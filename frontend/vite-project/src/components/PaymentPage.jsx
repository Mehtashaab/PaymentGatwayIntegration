import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

const stripePromise = loadStripe('pk_test_51QBE7YGHmX43kIbHoWPZSe8WaEpQ9ZJZFL6WEQQu7aqQDNtRZZYKkDGqwwwU67Ug2GW9phaf3a8IZRs8EP28q5fb004vcPiJOS');

const PaymentForm = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [customerName, setCustomerName] = useState('');  // State for customer name
    const [customerEmail, setCustomerEmail] = useState('');  // State for customer email
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const subscriptionId = location.state?.subscriptionId;
    const planName = location.state?.planName;
    const amount = location.state?.amount;

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (!subscriptionId || !planName || !amount) {
            Swal.fire({
                title: 'No Subscription Details',
                text: 'Please select a plan.',
                icon: 'warning',
                confirmButtonText: 'Go to Subscription',
            }).then(() => {
                navigate('/subscription');
            });
        }
    }, [isAuthenticated, subscriptionId, planName, amount, navigate]);

    const handlePaymentInitiation = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
    
        if (!stripe || !elements) {
            console.error('Stripe or Elements not loaded');
            return;
        }
    
        if (!customerName || !customerEmail) {
            setError('Please provide your name and email.');
            return;
        }
    
        try {
            // Log subscription and amount details
            console.log('Initiating payment for:', { subscriptionId, amount });
    
            // Send the payment initiation request to the server
            const response = await fetch('/api/subscription/initiate-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId,
                    amount,
                    customerEmail,  // Include customer email
                    customerName,   // Include customer name
                }),
            });
    
            // Check if the response is OK
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error(errorData.error || 'Failed to initiate payment');
            }
    
            const { clientSecret } = await response.json(); // Ensure the correct structure is being handled
            console.log('Client Secret:', clientSecret);
    
            // Confirm the card payment using the client secret
            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: customerName,
                        email: customerEmail,
                    },
                },
            });
    
            if (error) {
                console.error('Error confirming card payment:', error);
                throw new Error(error.message);
            }
            if(paymentIntent) {
                // After confirming the payment, check its status
                const paymentStatus = paymentIntent.status;
    
                // Save payment information in your database
                await fetch('/api/subscription/update-payment-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        paymentStatus, // 'succeeded' or 'requires_payment_method' etc.
                        amount,
                        customerEmail,
                        customerName,
                    }),
                });
    
                if (paymentStatus === 'succeeded') {
                    Swal.fire({
                        title: 'Payment Successful',
                        text: 'Your payment was successfully processed.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    navigate('/'); // Redirect to success page
                } else {
                    Swal.fire({
                        title: 'Payment Failed',
                        text: 'Your payment could not be processed.',
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                    });
                }
            }
    
            // if (paymentIntent && paymentIntent.status === 'succeeded') {
            //     Swal.fire({
            //         title: 'Payment Successful',
            //         text: 'Your payment was successfully processed.',
            //         icon: 'success',
            //         confirmButtonText: 'OK',
            //     });
            //     navigate('/'); // Redirect after successful payment
            // }
        } catch (err) {
            console.error('Payment initiation failed:', err);
            Swal.fire({
                title: 'Payment Failed',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };
    
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-200 to-gray-400 p-6">
            <div className="backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 rounded-3xl shadow-2xl p-8 w-full max-w-lg transition-all duration-300 ease-in-out hover:shadow-3xl border border-white border-opacity-30">
                <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
                    Payment for <span className="text-blue-600">{planName}</span>
                </h2>

                <div className="mb-6 p-6 bg-white bg-opacity-30 rounded-2xl border border-gray-300 shadow-inner transition-all duration-300 ease-in-out">
                    <p className="text-lg font-semibold text-gray-700">Plan: <span className="text-blue-600">{planName}</span></p>
                    <p className="text-lg text-gray-700">
                        Amount to Pay: <span className="font-bold text-gray-900">${amount}</span>
                    </p>
                </div>

                <form onSubmit={handlePaymentInitiation} className="space-y-6">
                    {/* Horizontal Layout for Input Fields */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        {/* Customer Name Input */}
                        <div className="flex-1">
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-600 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}  // Handle name change
                                required
                                className="block w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Customer Email Input */}
                        <div className="flex-1">
                            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-600 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="customerEmail"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}  // Handle email change
                                required
                                className="block w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Card Element Input */}
                    <div className="mb-4">
                        <label htmlFor="cardElement" className="block text-sm font-medium text-gray-600 mb-2">
                            Card Details
                        </label>
                        <div className="p-3 border border-gray-300 rounded-xl">
                            <CardElement
                                id="cardElement"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '18px',
                                            color: '#32325d',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#fa755a',
                                            iconColor: '#fa755a',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Payment Icons */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <FaCcVisa className="text-4xl text-blue-600 hover:scale-110 transition-transform duration-200 ease-in-out" />
                        <FaCcMastercard className="text-4xl text-red-600 hover:scale-110 transition-transform duration-200 ease-in-out" />
                        <FaCcAmex className="text-4xl text-blue-500 hover:scale-110 transition-transform duration-200 ease-in-out" />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-center mt-8">
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                        >
                            Pay ${amount}
                        </button>
                    </div>

                    {message && <div className="text-green-500 text-center font-semibold">{message}</div>}
                    {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
                </form>
            </div>
        </div>
    );
};

const PaymentPage = () => (
    <Elements stripe={stripePromise}>
        <PaymentForm />
    </Elements>
);

export default PaymentPage;
