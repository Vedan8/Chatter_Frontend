import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { email, setEmail, password, setPassword, setAccess, setUsername } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  // Google login handler (You can integrate with a real authentication library here)
  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    // Handle Google login logic (use Firebase, OAuth, etc.)
  };

  const LoginUser = async () => {
    console.log('Login with:', { email, password });
    setLoading(true); // Set loading to true before starting the request
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        email: email,
        password: password,
      });

      console.log(response.data); // Set the response data
      setAccess(response.data.access);
      setUsername(response.data.username);
      navigate('/posts');
    } catch (err) {
      console.log(err.message); // Handle any error that occurs during the API call
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginUser();
    console.log('Login with:', { email, password });
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
          Login
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
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <div className="spinner-border animate-spin w-5 h-5 border-4 border-t-4 border-white rounded-full"></div> // Add loading spinner
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-6 space-y-4 sm:space-y-0 animate-fadeIn">
          <button
            onClick={handleGoogleLogin}
            className="btn px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-105"
            disabled={loading} // Disable button while loading
          >
            Login with Google
          </button>
        </div>

        <div className="mt-10 text-gray-400 animate-fadeIn">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>

      <footer className="mt-10 text-gray-400 text-sm animate-fadeIn text-center relative z-10">
        &copy; 2025 Chatter. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
