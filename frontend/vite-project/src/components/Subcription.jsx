import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleSubscription = async (plan) => {
    setSelectedPlan(plan);
    try {
      const response = await axios.post(
        "/api/subscription/select-plan",
        { planName: plan },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert(`You have selected the ${plan} plan`);

      // Redirect to the payment component after selecting a plan
      navigate('/payment', { state: { subscriptionId: response.data.subscription._id } });
    } catch (error) {
      console.error("Subscription failed", error);
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Your Subscription Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Free Plan Card */}
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-4">Free Plan</h3>
          <p className="text-gray-600 mb-4">Perfect for trying out our services!</p>
          <div className="text-2xl font-bold text-gray-800">$0</div>
          <button
            onClick={() => handleSubscription("Free")}
            className="mt-4 w-full p-3 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Choose Plan
          </button>
        </div>

        {/* Monthly Plan Card */}
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-4">Monthly Plan</h3>
          <p className="text-gray-600 mb-4">Best for individuals who want flexibility.</p>
          <div className="text-2xl font-bold text-gray-800">$10</div>
          <button
            onClick={() => handleSubscription("Monthly")}
            className="mt-4 w-full p-3 bg-blue-200 rounded hover:bg-blue-300 transition"
          >
            Choose Plan
          </button>
        </div>

        {/* Yearly Plan Card */}
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-4">Yearly Plan</h3>
          <p className="text-gray-600 mb-4">Ideal for long-term users looking for savings.</p>
          <div className="text-2xl font-bold text-gray-800">$100</div>
          <button
            onClick={() => handleSubscription("Yearly")}
            className="mt-4 w-full p-3 bg-green-200 rounded hover:bg-green-300 transition"
          >
            Choose Plan
          </button>
        </div>
      </div>
      {selectedPlan && (
        <p className="mt-4 text-lg text-gray-800">You have selected the {selectedPlan} plan</p>
      )}
    </div>
  );
}

export default Subscription;
