import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    customerName: { 
        type: String, 
        required: true  // Name provided during payment
    },
    customerEmail: { 
        type: String, 
        required: true  // Email provided during payment
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD',  // Default currency is USD, but you can customize
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    stripePaymentIntentId: {
        type: String,
        required: true
    },
    stripeCustomerId: { 
        type: String, 
        required: false  // Optional Stripe customer ID for future reference
    },
    metadata: {
        type: Map, 
        of: String,  // Map to store any additional metadata related to the payment
        default: {}
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
