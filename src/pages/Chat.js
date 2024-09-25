// Chat.js
import React, { useState, useEffect } from 'react';
import { Circles } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

export const Chat = (props) => {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors
  const [chatLoading, setChatLoading] = useState(null); // State to track which user is being clicked
  const [chatSuccess, setChatSuccess] = useState(null); // State for success messages
  const [chatError, setChatError] = useState(null); // State for error messages
  const navigate = useNavigate();
  const MessageRoute=()=>{
      navigate('/Messages')
  }
  const postNavigate=()=>{
    navigate('/Posts')
  }
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (!props.access) {
          throw new Error('Authentication token not found. Please log in.');
        }

        const response = await fetch('https://chatter-backend-jy95.onrender.com/api/users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.access}`, // Include JWT token in headers
          },
        });

        if (!response.ok) {
          // If response is not OK, throw an error to be caught
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch users.');
        }

        const data = await response.json();
        setUsers(data); // Update users state with fetched data
      } catch (err) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchUsers();
  }, [props.access]);

  // Function to handle user click and initiate chat
  const handleUserClick = async (username) => {
    setChatLoading(username);
    setChatSuccess(null);
    setChatError(null);

    try {
      const response = await fetch('https://chatter-backend-jy95.onrender.com/api/chats/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.access}`, // Include JWT token in headers
        },
        body: JSON.stringify({ username }), // Sending the clicked username
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to initiate chat.');
      }

      const responseData = await response.json();
      console.log('Chat initiated successfully:', responseData);
      props.setChat_id(responseData.id)
      MessageRoute()
      setChatSuccess(`Chat with ${username} initiated successfully!`);
    } catch (err) {
      console.error(err);
      setChatError(err.message || 'An unexpected error occurred while initiating chat.');
    } finally {
      setChatLoading(null);
    }
  };

  return (
    <div className="bg-cyan-100 min-h-screen w-screen flex justify-center items-center">
      <div className="bg-cyan-50 h-[90vh] w-[90vw] rounded-2xl shadow-xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex relative mt-2 items-center">
          <div className="absolute left-5 text-lg font-serif">Chatter</div>
          <div className="flex m-auto gap-5">
            <span onClick={postNavigate} className='cursor-pointer'><p className="font-semibold text-gray-500">Posts</p></span>
            <p className="font-semibold text-gray-500">Chats</p>
          </div>
        </div>

        {/* Success and Error Messages */}
        <div className="mt-4">
          {chatSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{chatSuccess}</span>
            </div>
          )}
          {chatError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{chatError}</span>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="flex-grow overflow-auto mt-4">
          {loading ? (
            // Loader while fetching users
            <div className="flex justify-center items-center">
              <Circles color="#00BFFF" height={50} width={50} />
            </div>
          ) : error ? (
            // Display error message if any
            <div className="text-red-500 text-center">{error}</div>
          ) : users.length === 0 ? (
            // Message when no users are available
            <p className="text-center text-gray-500">No users available</p>
          ) : (
            // Display list of users
            users.map((user) => (
              <div
                key={user.email}
                onClick={() => handleUserClick(user.username)}
                className={`bg-white p-4 rounded-lg shadow-md mb-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                  chatLoading === user.username ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {/* User Profile Image */}
                <img
                  src={user.profileImage}
                  alt={`${user.username}'s profile`}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />

                {/* User Information */}
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                </div>

                {/* Loader on clicking user */}
                {chatLoading === user.username && (
                  <Circles color="#00BFFF" height={20} width={20} className="ml-auto" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
