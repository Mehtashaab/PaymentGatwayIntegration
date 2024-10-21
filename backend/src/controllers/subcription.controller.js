import User from "../models/user.model.js";
import Subscription from "../models/subcription.model.js";
import Payment from "../models/payment.model.js";
import Stripe from "stripe";

// Select Subscription Plan
const selectPlan = async (req, res) => {
  const { planName } = req.body;

  const plans = {
    Free: { price: 0, duration: "Monthly" },
    Monthly: { price: 10, duration: "Monthly" },
    Yearly: { price: 100, duration: "Yearly" },
  };

  if (!plans[planName]) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create subscription
    const subscription = new Subscription({
      planName,
      price: plans[planName].price,
      duration: plans[planName].duration,
      user: user._id,
    });

    await subscription.save();
    user.subscription = subscription._id;
    await user.save({ validateBeforeSave: false });

    return res.status(201).json({
      message: "Subscription selected successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error selecting subscription plan:", error.message);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

const stripeInstance = new Stripe("sk_test_51QBE7YGHmX43kIbHxdVdrgP7UYBricmJ73brluJZ4UMc2y7zOxa1BKlycDKHPUrVNt10q7ZvwGlfoJWbiAE1Ik8n00DSDac0go"); // Your secret Stripe API key

const initiatePayment = async (req, res) => {
    const { subscriptionId, amount, customerName, customerEmail } = req.body;

    try {
        // Validate the incoming data
        if (!customerName || !customerEmail) {
            return res.status(400).json({ error: "Customer name and email are required." });
        }

        // Find user and subscription
        const user = await User.findById(req.user._id);
        const subscription = await Subscription.findById(subscriptionId);

        if (!user || !subscription) {
            return res.status(404).json({ error: "User or subscription not found" });
        }

        // Create a payment intent
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: "usd",
            payment_method_types: ["card"],
            receipt_email: customerEmail,
            metadata: {
                userId: user._id.toString(),
                subscriptionId: subscription._id.toString(),
                customerName,
                customerEmail,
            },
        });

        // Save initial payment info as 'Pending'
        const payment = new Payment({
            user: user._id,
            subscription: subscription._id,
            amount,
            paymentStatus: "Pending",
            stripePaymentIntentId: paymentIntent.id,
            customerEmail,
            customerName,
        });

        await payment.save();

        return res.status(200).json({
            message: "Payment initiated successfully",
            clientSecret: paymentIntent.client_secret,
            payment,
        });
    } catch (error) {
        console.error("Error initiating payment:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

const updatePaymentDetails = async (req, res) => {
    const { paymentIntentId, paymentStatus, amount, customerEmail, customerName } = req.body;

    try {
        // Validate input
        if (!paymentIntentId || !paymentStatus) {
            return res.status(400).json({ error: "Payment intent ID and status are required." });
        }

        // Update payment record based on paymentIntentId
        const payment = await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntentId },
            { paymentStatus, amount, customerEmail, customerName },
            { new: true, upsert: true } // Create if it doesn't exist
        );

        return res.status(200).json({
            message: 'Payment status updated successfully',
            payment,
        });
    } catch (error) {
        console.error('Error updating payment status:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export { selectPlan, initiatePayment,updatePaymentDetails };
