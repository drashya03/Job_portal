// import { Webhook } from "svix";
// import User from "../models/User.js";

// Webhooks allow interaction between web-based applications through the use of custom callbacks. 
// The use of webhooks allows web applications to automatically communicate with other web-apps. 
// Unlike traditional systems where one system (subject) keeps polling another system (observer) for some data, 
// Webhooks allow the observer to push data into the subject's system automatically whenever some event occurs. 

// This eliminates the need for constant checking to be done by the subject. 
// Webhooks operate entirely over the internet, and hence, 
// all communication between systems must be in the form of HTTP messages.


// API controller function to manage clerk user with database

// const clerkWebhooks = async (req,res) => {
//     try{

//         // Create a Svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         // verify header
//         await whook.verify.apply(JSON.stringify(req.body),{
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp" : req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         })

//         // getting data from req body

//         const {data,type} = req.body
//         switch(type){

//             case 'user.created':{
//                 const userData = {
//                     _id:data.id,
//                     email:data.email_adderess[0].email_adderess,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                     resume: ''
//                 }
//                 await User.create(userData)
//                 res.json({})
//                 break;
//             }

//             case 'user.updated':{

//                  const userData = {
//                     email:data.email_adderess[0].email_adderess,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                 }
//                 await User.findByIdAndUpdate(data.id,userData)
//                 res.json({})
//                 break;
//             }

//             case 'user.deleted':{
//                 await User.findByIdAndDelete(data.id)
//                 res.json({})
//                 break;
//             }

//             default:
//                 break;
//         }

//     } catch (error){
//         console.log(error.message);
//         res.json({success:false,message:'webhooks Error'})

//     }
// }








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