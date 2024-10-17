import React, { useState } from 'react';

const InitiatePayment = () => {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePaymentInitiation = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/subscription/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the token if needed
          // 'Authorization': `Bearer ${your_access_token_here}`,
        },
        body: JSON.stringify({ subscriptionId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      setMessage(data.message);
      setSubscriptionId('');
      setAmount('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Initiate Payment</h2>
        <form onSubmit={handlePaymentInitiation}>
          <div className="mb-4">
            <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700">
              Subscription ID:
            </label>
            <input
              type="text"
              id="subscriptionId"
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          >
            Initiate Payment
          </button>
        </form>

        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default InitiatePayment;
