import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { email, setEmail, password, setPassword, setAccess, setUsername } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // Custom Google login button handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse.access_token)
      axios.post('https://chatter-backend-jy95.onrender.com/api/google-login/', { token: tokenResponse.access_token })
        .then((res) => {
          console.log('Backend response:', res.data);
          setAccess(res.data.access);
          setUsername(res.data.username);
          navigate('/posts');
        })
        .catch((err) => console.error('Google login backend error:', err));
    },
    onError: () => console.log('Google Login Failed'),
  });

  // Regular email/password login
  const LoginUser = async () => {
    console.log('Login with:', { email, password });
    setLoading(true);
    try {
      const response = await axios.post('https://chatter-backend-jy95.onrender.com/api/login/', { email, password });
      console.log(response.data);
      setAccess(response.data.access);
      setUsername(response.data.username);
      navigate('/posts');
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginUser();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4">
      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 shadow-lg transition-transform transform hover:scale-105 flex justify-center"
            disabled={loading}
          >
            {loading ? <div className="spinner-border animate-spin w-5 h-5 border-4 border-t-4 border-white rounded-full"></div> : 'Login'}
          </button>
        </form>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-105"
            disabled={loading}
          >
            Login with Google
          </button>
        </div>

        <div className="mt-10 text-gray-400">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
