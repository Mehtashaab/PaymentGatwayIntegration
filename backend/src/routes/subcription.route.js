import { Router } from "express";
import { selectPlan,initiatePayment, updatePaymentDetails } from "../controllers/subcription.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const router = Router();



router.route("/select-plan").post(verifyJWT,selectPlan);
router.route("/initiate-payment").post(verifyJWT,initiatePayment);
router.route("/update-payment-status").post(verifyJWT,updatePaymentDetails);


export default router;