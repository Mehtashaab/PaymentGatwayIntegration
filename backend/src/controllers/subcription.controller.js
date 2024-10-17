import  User  from '../models/user.model.js';
import  Subscription  from '../models/subcription.model.js';
import  Payment  from '../models/payment.model.js';

// Select Subscription Plan
const selectPlan = async (req, res) => {
  const { planName } = req.body;

  const plans = {
    Free: { price: 0, duration: 'Monthly' },
    Monthly: { price: 10, duration: 'Monthly' },
    Yearly: { price: 100, duration: 'Yearly' },
  };

  if (!plans[planName]) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
      message: 'Subscription selected successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error selecting subscription plan:', error.message);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
};

// Payment for Subscription (Basic)

 const initiatePayment = async (req, res) => {
  const { subscriptionId, amount } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const subscription = await Subscription.findById(subscriptionId);

    if (!user || !subscription) {
      return res.status(404).json({ error: 'User or subscription not found' });
    }

    // Create payment
    const payment = new Payment({
      user: user._id,
      subscription: subscription._id,
      amount,
      paymentStatus: 'Completed',  // Mocking payment for now
    });

    await payment.save();
    return res.status(200).json({
      message: 'Payment initiated successfully',
      payment,
    });
  } catch (error) {
    console.error('Error initiating payment:', error.message);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
};


export {selectPlan,initiatePayment}