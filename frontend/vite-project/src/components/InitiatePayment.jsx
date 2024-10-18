import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const InitiatePayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve subscription details from the `location.state`
  const subscriptionId = location.state?.subscriptionId;
  const planName = location.state?.planName;
  const amount = location.state?.amount;

  // Redirect to subscription page if details are missing
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if user is not authenticated
    } else if (!subscriptionId || !planName || !amount) {
      Swal.fire({
        title: 'No Subscription Details',
        text: 'Please select a plan.',
        icon: 'warning',
        confirmButtonText: 'Go to Subscription',
      }).then(() => {
        navigate('/subscription'); // Redirect to subscription page
      });
    }
  }, [isAuthenticated, subscriptionId, planName, amount, navigate]);

  const handlePaymentInitiation = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = "access-token-from-context"; // Fetch token from context if needed

      const response = await fetch('/api/subscription/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionId, amount, cardNumber, expiryDate, cvv }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment initiation failed');

      // Show success message
      Swal.fire({
        title: 'Payment Successful',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Reset the form fields after successful payment
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      // Redirect to payment success page
      navigate('/');
    } catch (err) {
      // Show error message
      Swal.fire({
        title: 'Payment Failed',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Payment for {planName}</h2>

        {/* Plan Details */}
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <p className="text-lg font-semibold">Plan: {planName}</p>
          <p className="text-lg">Amount to Pay: <strong>${amount}</strong></p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePaymentInitiation} className="space-y-4">
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="123"
              />
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
              >
                Pay ${amount}
              </button>
            </div>
          </div>
        </form>

        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default InitiatePayment;
