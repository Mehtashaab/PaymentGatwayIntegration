import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import subcriptionRoutes from "./src/routes/subcription.route.js";
import cookieParser from "cookie-parser";
// import subscriptionRoutes from './src/routes/subscription.route.js';
import cors from 'cors';
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Import routes
app.use('/auth', authRoutes);
app.use('/subcription',subcriptionRoutes);




export {app};