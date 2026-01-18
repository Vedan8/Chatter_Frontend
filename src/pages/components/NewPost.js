import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewPost = () => {
  const { access } = useContext(AuthContext);
  const [postImage, setPostImage] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(""); // Default preview image
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('postImage', postImage);
    formData.append('description', description);

    try {
      const response = await axios.post(
        'https://chatter-backend-jy95.onrender.com/api/posts/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Post created:', response.data);
      navigate('/posts');
    } catch (err) {
      console.log('Error creating post:', err.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl animate-fadeIn max-w-2xl relative z-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 pb-4">
          Create a New Post
        </h1>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid rounded-full border-purple-500 border-t-transparent"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 animate-fadeIn">
          {/* Post Image Upload Section */}
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Post Preview"
              className="w-64 h-64 rounded-lg object-cover border-4 border-purple-500 shadow-lg mb-4"
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

          {/* Description Input */}
          <div>
            <textarea
              placeholder="Write a description..."
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none text-center"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 shadow-lg transition-transform transform hover:scale-105"
          >
            Post
          </button>
        </form>
      </div>
      <footer className="mt-10 text-gray-400 text-sm animate-fadeIn text-center relative z-10">
        &copy; 2025 Chatter. All rights reserved.
      </footer>
    </div>
  );
};

export default NewPost;