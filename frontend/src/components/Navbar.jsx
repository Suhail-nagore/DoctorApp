import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Remove the authToken from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('operatorName');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="DoctorApp Logo" 
              className="h-16"
            />
          </div>

          {/* Right side - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </a>
            <a
              href="/patient-form"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Patient Form
            </a>
            <a
              href="/collection"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Collection
            </a>
            <a
              href="/unbilled-transactions"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Unbilled Transactions
            </a>
            <a
              href="/admin/login"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </a>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
             className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="mobile-menu-button p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="/patient-form"
            className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Patient Form
          </a>
          <a
              href="/collection"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Collection
            </a>
          <a
            href="/unbilled-transactions"
            className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Unbilled Transactions
          </a>
          <a
            href="/admin/login"
            className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Admin
          </a>
          {/* Logout Button in Mobile Menu */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
