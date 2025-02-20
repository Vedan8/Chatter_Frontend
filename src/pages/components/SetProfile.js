import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SetProfile = () => {
  const { access, username, setUsername } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("https://www.w3schools.com/w3images/avatar2.png"); // Default avatar
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file)); // Update preview
  };

  // Send username separately
  const sendUsername = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/update-username/',
        { username },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Username updated:', response.data);
    } catch (err) {
      console.log('Error updating username:', err.message);
    }
  };

  // Send profile image separately
  const sendProfileImage = async () => {
    if (!profileImage) return; // Don't send request if no image is selected

    const formData = new FormData();
    formData.append('profileImage', profileImage);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/update-profileImage/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Profile image updated:', response.data);
    } catch (err) {
      console.log('Error updating profile image:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    await sendUsername(); // Send username
    await sendProfileImage(); // Send profile image
    setLoading(false); // Stop loading
    navigate('/posts'); // Navigate after both requests complete
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background animation */}
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

      {/* Main Content */}
      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl animate-fadeIn max-w-2xl relative z-10">
        <h1
          className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          style={{ lineHeight: '1.2', paddingBottom: '0.5rem' }}
        >
          Choose Your Username
        </h1>

        {/* Loader: Displayed while loading */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid rounded-full border-purple-500 border-t-transparent"></div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 animate-fadeIn">
          
          {/* Profile Image Upload Section */}
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg mb-4"
            />
            <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-200">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Username Input */}
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 shadow-lg transition-transform transform hover:scale-105"
          >
            Submit
          </button>
        </form>
      </div>

      <footer className="mt-10 text-gray-400 text-sm animate-fadeIn text-center relative z-10">
        &copy; 2025 Chatter. All rights reserved.
      </footer>
    </div>
  );
};

export default SetProfile;
