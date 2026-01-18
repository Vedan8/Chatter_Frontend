import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState({});
  const { access } = useContext(AuthContext);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/posts/", {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [access]);

  // Handle like/unlike logic
  const handleLike = async (postId, isLiked) => {
    try {
      const url = `http://127.0.0.1:8000/api/posts/${postId}/like/`;
      const headers = {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      };

      if (isLiked) {
        await axios.delete(url, { headers });
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes - 1, isLiked: false } : post
          )
        );
      } else {
        await axios.patch(url, {}, { headers });
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1, isLiked: true } : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  // Handle new comment submission
  const handleCommentSubmit = async (postId) => {
    try {
      const url = `http://127.0.0.1:8000/api/comments/${postId}/`;
      const headers = {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(url, { comment: newComment }, { headers });
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), response.data],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const url = `http://127.0.0.1:8000/api/comments/${postId}/`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: response.data,
      }));
      setShowComments((prevShowComments) => ({
        ...prevShowComments,
        [postId]: true,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Toggle comment visibility
  const toggleComments = (postId) => {
    if (!showComments[postId]) {
      fetchComments(postId);
    }
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [postId]: !prevShowComments[postId],
    }));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center py-10 px-4">
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-10 animate-parallax "
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#6B46C1"
          fillOpacity="0.6"
          d="M0,160L120,138.7C240,117,480,75,720,101.3C960,128,1200,224,1320,272L1440,320V0H0Z"
        ></path>
      </svg>
      <div className="flex items-center justify-between w-full max-w-2xl">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate__animated animate__fadeIn">
          Explore Posts
        </h1>

        <div className="flex items-center space-x-4">
        <Link
  to="/new-post"
  className="px-6 py-2 text-lg font-semibold text-gray-100 bg-[#7496cc] border border-gray-400 rounded-lg shadow-md transition-all transform hover:bg-[#4b73a1] hover:border-gray-500"
>
  New Post
</Link>




<Link
  to="/chat"
  className="px-6 py-2 text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all relative z-10"
>
  Chat
</Link>

        </div>
      </div>

      <div className="w-full max-w-2xl mt-8 space-y-6">
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center animate__animated animate__fadeIn">
            No posts available.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl p-4 flex flex-col items-center space-y-4 animate__animated animate__fadeIn"
            >
              <img
                src={post.imageUrl}
                alt={post.description}
                className="w-full max-h-96 object-cover rounded-lg"
              />
              <p className="text-lg font-semibold text-white">{post.user || "Anonymous"}</p>
              <p className="text-md text-gray-300">{post.description}</p>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">❤️ {post.likes}</span>
                <button
                  onClick={() => handleLike(post.id, post.isLiked)}
                  className={`px-4 py-2 ${
                    post.isLiked ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                  } rounded-lg transition`}
                >
                  {post.isLiked ? "Unlike" : "Like"}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Comment
                </button>
              </div>

              {showComments[post.id] && (
                <div className="mt-4 w-full space-y-4 animate__animated animate__fadeIn">
                  {comments[post.id] && comments[post.id].length > 0 ? (
                    comments[post.id].map((comment) => (
                      <div key={comment.id} className="text-sm text-gray-300">
                        <p>{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No comments yet.</p>
                  )}
                </div>
              )}

              {showComments[post.id] && (
                <div className="mt-4 w-full animate__animated animate__fadeIn">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="mt-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                  >
                    Submit Comment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
