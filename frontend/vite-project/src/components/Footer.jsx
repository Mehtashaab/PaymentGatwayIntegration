import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} Abhishek Mehta. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="text-white text-sm hover:text-gray-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white text-sm hover:text-gray-400">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-white text-sm hover:text-gray-400">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;