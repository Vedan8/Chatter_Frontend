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

  // Fetch posts and liked posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://chatter-backend-jy95.onrender.com/api/posts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.access}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts.');
        }

        const data = await response.json();
        setPosts(data);

        // Check the user's liked posts from the server
        const likedResponse = await fetch('https://chatter-backend-jy95.onrender.com/api/likes/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.access}`,
          },
        });

        if (likedResponse.ok) {
          const likedData = await likedResponse.json();
          const likedPostIds = {};
          likedData.forEach((like) => {
            likedPostIds[like.post.id] = true; // Set post ID as liked
          });
          setLikedPosts(likedPostIds); // Update the likedPosts state
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [props.access]);

  // Handle like button click (toggling the like state)
  const handleLike = async (postIndex) => {
    const updatedPosts = [...posts];
    const postId = updatedPosts[postIndex].id;
    const isLiked = likedPosts[postId];

    // Update likedPosts state
    const newLikedPosts = { ...likedPosts, [postId]: !isLiked };

    // Persist the like/unlike change to the database
    try {
      if (isLiked) {
        // If post is liked, we need to unlike it
        await fetch(`https://chatter-backend-jy95.onrender.com/api/likes/${postId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.access}`,
          },
        });
        updatedPosts[postIndex].likes -= 1; // Decrease like count
      } else {
        // If post is unliked, we need to like it
        await fetch('https://chatter-backend-jy95.onrender.com/api/likes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.access}`,
          },
          body: JSON.stringify({ post: postId }), // Assuming post ID is needed
        });
        updatedPosts[postIndex].likes += 1; // Increase like count
      }

      setLikedPosts(newLikedPosts);
      setPosts(updatedPosts);
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
                    src={post.user.profileImageUrl}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <p className="font-semibold text-gray-800">{post.user.username}</p>
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
