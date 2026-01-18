import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'; // ✅ MISSING IMPORT FIXED

const Register = () => {
  // ✅ FIX: include setAccess & setUsername
  const {
    email,
    setEmail,
    password,
    setPassword,
    setAccess,
    setUsername,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const RegisterUser = async () => {
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        email,
        password,
      });
      navigate('/otpvalidate');
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google register/login (same flow as login)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      axios
        .post('http://127.0.0.1:8000/api/google-login/', {
          token: tokenResponse.access_token,
        })
        .then(res => {
          setAccess(res.data.access);
          setUsername(res.data.username);
          navigate('/posts');
        })
        .catch(err => console.error('Google login backend error:', err));
    },
    onError: () => console.log('Google Login Failed'),
  });

  const handleSubmit = e => {
    e.preventDefault();
    RegisterUser();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4">
      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
            disabled={loading}
          >
            Register
          </button>
        </form>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900"
          >
            Register with Google
          </button>
        </div>

        <div className="mt-10 text-gray-400">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
