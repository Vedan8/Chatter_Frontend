import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { email, setEmail, password, setPassword } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const RegisterUser = async () => {
    console.log('Registering with:', { email, password });
    setLoading(true); // Set loading to true when API call starts
    try {
      const response = await axios.post('https://chatter-backend-jy95.onrender.com/api/register/', {
        email: email,
        password: password,
      });
      console.log(response.data); // Set the response data
      navigate('/otpvalidate');
    } catch (err) {
      console.log(err.message); // Handle any error that occurs during the API call
    } finally {
      setLoading(false); // Set loading to false when the API call is done
    }
  };

  // Google login handler (You can integrate with a real authentication library here)
  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    // Handle Google login logic (use Firebase, OAuth, etc.)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering Api Called');
    RegisterUser();
  };

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

      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl animate-fadeIn max-w-2xl relative z-10">
        <h1
          className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          style={{ lineHeight: '1.2', paddingBottom: '0.5rem' }}
        >
          Register
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 animate-fadeIn">
          Create your account and join the conversation!
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 animate-fadeIn">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 shadow-lg transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-6 space-y-4 sm:space-y-0 animate-fadeIn">
          <button
            onClick={handleGoogleLogin}
            className="btn px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-105"
          >
            Register with Google
          </button>
        </div>

        <div className="mt-10 text-gray-400 animate-fadeIn">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="loader">Loading...</div>
        </div>
      )}

      <footer className="mt-10 text-gray-400 text-sm animate-fadeIn text-center relative z-10">
        &copy; 2025 Chatter. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;
