import React, { useState, useEffect } from 'react';
import { Circles } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

export const Post = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({}); // Track liked/unliked state

  const navigate = useNavigate();
  const ChatButton = () => {
    navigate('/Chats');
  };

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

  // Handle like button click (toggling the like state)
  const handleLike = async (postIndex) => {
    const updatedPosts = [...posts];
    const postId = updatedPosts[postIndex].id;
    const isLiked = likedPosts[postId];

    // Toggle like count locally
    if (isLiked) {
      updatedPosts[postIndex].likes -= 1; // Decrease like count
    } else {
      updatedPosts[postIndex].likes += 1; // Increase like count
    }

    // Update likedPosts state
    setLikedPosts({ ...likedPosts, [postId]: !isLiked });
    setPosts(updatedPosts);

    // Persist the like change to the database
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
      <div className="bg-cyan-50 h-[full] w-[full] sm:w-[90vw] sm:h-[90vh] rounded-2xl shadow-xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex relative mt-2 items-center">
          <div className="absolute left-5 text-lg font-serif">Chatter</div>
          <div className="flex m-auto gap-5">
            <p className="font-semibold text-gray-500">Posts</p>
            <span onClick={ChatButton} className='cursor-pointer'>
              <p className="font-semibold text-gray-500">Chats</p>
            </span>
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
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 w-full sm:w-[500px] h-fit m-auto">
                {/* User Info */}
                <div className="flex items-center mb-2">
                  <img
                    src={post.user.profileImage}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <p className="font-semibold text-gray-800">{post.user}</p>
                </div>

                {/* Post Image */}
                {post.postImage && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full object-fit rounded-lg mb-2 max-h-[100%]"
                  />
                )}

                {/* Description */}
                <p className="text-gray-700 mb-2">{post.description}</p>

                {/* Likes and Like Button */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">{post.likes} Likes</p>
                  <button
                    onClick={() => handleLike(index)}
                    className={`flex items-center px-3 py-1 rounded-lg text-white ${likedPosts[post.id] ? 'bg-red-500' : 'bg-yellow-500'} hover:${likedPosts[post.id] ? 'bg-red-700' : 'bg-yellow-700'}`}
                  >
                    {likedPosts[post.id] ? 'Unlike' : 'Like'}
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
