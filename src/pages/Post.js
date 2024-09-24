import React, { useState, useEffect } from 'react';
import { Circles } from 'react-loader-spinner';

export const Post = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://chatter-backend-jy95.onrender.com/api/posts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.access}`, // Add Bearer token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts.');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle like button click (updating the like count locally)
  const handleLike = async (postIndex) => {
    const updatedPosts = [...posts];
    updatedPosts[postIndex].likes += 1; // Increment the like count locally
    setPosts(updatedPosts);

    // If you want to persist the like change, make an API call here
    try {
      const post = updatedPosts[postIndex];

      await fetch(`https://chatter-backend-jy95.onrender.com/api/posts/${post.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.access}`, // Add Bearer token in the Authorization header
        },
        body: JSON.stringify({ likes: post.likes }), // Update the like count on the server
      });
    } catch (err) {
      console.error('Failed to update like:', err);
    }
  };

  return (
    <div className="bg-cyan-100 min-h-screen w-screen flex justify-center items-center">
      <div className="bg-cyan-50 h-[90vh] w-[90vw] rounded-2xl shadow-xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex relative mt-2 items-center">
          <div className="absolute left-5 text-lg font-serif">Chatter</div>
          <div className="flex m-auto gap-5">
            <p className="font-semibold text-gray-500">Post</p>
            <p className="font-semibold text-gray-500">Chat</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-grow overflow-auto mt-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <Circles color="#00BFFF" height={50} width={50} />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available</p>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
                {/* User Info */}
                <div className="flex items-center mb-2">
                  <img
                    src={post.user.profileImage}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <p className="font-semibold text-gray-800">{post.user.username}</p>
                </div>

                {/* Post Image */}
                {post.postImage && (
                  <img
                    src={post.postImage.url}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg mb-2"
                  />
                )}

                {/* Description */}
                <p className="text-gray-700 mb-2">{post.description}</p>

                {/* Likes and Like Button */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">{post.likes} Likes</p>
                  <button
                    onClick={() => handleLike(index)}
                    className="flex items-center px-3 py-1 rounded-lg text-white bg-yellow-500 hover:bg-yellow-700"
                  >
                    Like
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
