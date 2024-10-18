import React from 'react';
import Navbar from './Navbar';

const Header = () => {
  return (
    <header className="bg-gray-300 shadow-lg py-4">
      <div className="max-w-6xl mx-auto px-4">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
