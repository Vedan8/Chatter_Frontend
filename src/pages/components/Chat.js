import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const defaultAvatar =
  "https://www.w3schools.com/w3images/avatar2.png"; // Placeholder for default avatar

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { access, setChat_id } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchUsers();
  }, [access]);

  // Handle user click and create chat
  const handleUserClick = async (username) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chats/create/",
        { username },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Chat created successfully:", response.data);
      setChat_id(response.data.id);
      navigate(`/message/`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center py-10 px-4">
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
      <div className="flex items-center justify-between w-full max-w-2xl">
        {/* Explore Posts button */}
        <Link
          to="/posts"
          className="px-6 py-2 text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all"
        >
          Explore Posts
        </Link>

        {/* Chat heading */}
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate__animated animate__fadeIn">
          Chat
        </h1>
      </div>

      <div className="w-full max-w-2xl mt-8 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-400 rounded-full animate-spin"></div> {/* Loader */}
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center animate__animated animate__fadeIn animate__delay-1s">
            No users available.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl p-4 flex items-center space-x-4 animate__animated animate__fadeIn animate__delay-2s"
              onClick={() => handleUserClick(user.username)} // Trigger the chat creation on click
            >
              <img
                src={user.profileImageUrl || defaultAvatar} // Display profile image or default avatar
                alt={user.username}
                className="w-12 h-12 object-cover rounded-full"
              />
              <p className="text-lg font-semibold text-white">{user.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersPage;
