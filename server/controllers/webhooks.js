import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
    try {
        // 1. Get raw body for verification
        const payload = JSON.stringify(req.body);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // 2. Verify webhook
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = wh.verify(payload, headers);
        const { type, data } = evt;

        console.log(`Processing Clerk webhook: ${type}`);

        // 3. Handle different webhook events
        // MongoDB ka kam chalu
        
        switch (type) {
            case 'user.created':
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    image: data.image_url || '',
                    resume: ''
                });
                console.log(`User created: ${data.id}`);
                break;

            case 'user.updated':
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    image: data.image_url || ''
                }, { new: true });
                console.log(`User updated: ${data.id}`);
                break;

            case 'user.deleted':
                await User.findByIdAndDelete(data.id);
                console.log(`User deleted: ${data.id}`);
                break;
        }

        res.status(200).json({ success: true });
        
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
};

export { clerkWebhooks };