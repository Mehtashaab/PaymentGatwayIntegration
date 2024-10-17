import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import subscriptionRoutes from "./src/routes/subcription.route.js";
import cookieParser from "cookie-parser";
// import subscriptionRoutes from './src/routes/subscription.route.js';
import cors from 'cors';
const app = express();
const combinedRouter = express.Router();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Import routes
// Use both routes under the same base path
combinedRouter.use('/auth', authRoutes);
combinedRouter.use('/subscription', subscriptionRoutes);

app.use('/api', combinedRouter);




export {app};