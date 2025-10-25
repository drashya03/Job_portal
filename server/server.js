import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import './config/instrument.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
 

const app = express()

// connect DB

await connectDB()

await connectCloudinary()

// MiddleWare

app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())


// Routes
app.get('/',(req,res)=> {
    res.json({ message: "API is working", status: "success" });
});


app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


app.post('/api/webhooks/clerk', 
    express.raw({ type: 'application/json' }), // Important: Get raw body
    clerkWebhooks
);

app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users/',userRoutes)


// Port 
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})















