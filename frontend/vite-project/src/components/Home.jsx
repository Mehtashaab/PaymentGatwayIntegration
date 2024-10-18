import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to MyApp!</h1>
        <p className="text-lg text-gray-600 mb-6">
          MyApp is the best place to manage your subscriptions and explore our features.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
