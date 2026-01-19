import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate('/register');
  }
  const handleLoginClick = () => {
    navigate('/login');
  }
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-10 animate-parallax"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#6B46C1"
          fillOpacity="0.6"
          d="M0,160L120,138.7C240,117,480,75,720,101.3C960,128,1200,224,1320,272L1440,320V0H0Z"
        ></path>
      </svg>

      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl animate-fadeIn max-w-3xl relative z-10">
        <h1
          className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Chatter
        </h1>
        <p
          className="mt-6 text-lg text-gray-300 animate-fadeIn"
          style={{ animation: 'fadeIn 1.5s ease-out' }}
        >
          A modern social media platform for real-time conversations.
        </p>
        <p
          className="mt-2 text-md text-gray-400 animate-slideIn"
          style={{ animation: 'slideIn 1.5s ease-in-out' }}
        >
          Join us today and connect with people worldwide.
        </p>

        <div
          className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-6 space-y-4 sm:space-y-0 animate-fadeIn"
          style={{ animation: 'fadeIn 2s ease-out' }}
        >
          <button
            className="btn px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 shadow-lg transition-transform transform hover:scale-105"
            onClick={handleRegisterClick}
          >
            Get Started
          </button>
          <button
            className="btn px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-105"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>

        <div
          className="mt-10 text-gray-400 animate-fadeIn"
          style={{ animation: 'fadeIn 2.5s ease-out' }}
        >
          <p>Stay updated with the latest trends, engage in discussions, and make new friends.</p>
          <p className="mt-3">Experience a seamless and secure platform designed for you.</p>
        </div>
      </div>

      <footer
        className="mt-10 text-gray-400 text-sm animate-fadeIn text-center relative z-10"
        style={{ animation: 'fadeIn 3s ease-out' }}
      >
        &copy; 2025 Chatter. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;