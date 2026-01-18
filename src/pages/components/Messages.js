import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const { chat_id, access, username } = useContext(AuthContext);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch previous messages
  const fetchMessages = async () => {
    try {
      setLoading(true); // Show loader
      const response = await axios.get(
        `https://chatter-backend-jy95.onrender.com/api/chats/${chat_id}/messages/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      // Format the past messages to match WebSocket message format
      const formattedMessages = response.data.map((msg) => ({
        content: msg.content,
        sender: msg.sender.username, // Assuming past messages have 'username' under 'sender'
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchMessages();

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${chat_id}`
    );

    socket.onopen = () => console.log("WebSocket connected.");

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log("Received message:", receivedData);

      if (receivedData?.message && receivedData?.sender) {
        // Format WebSocket message to match the format of past messages
        const formattedMessage = {
          content: receivedData.message,
          sender: receivedData.sender, // 'sender' is a string here, as per WebSocket format
        };

        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      }
    };

    socket.onerror = (error) => console.error("WebSocket Error:", error);
    socket.onclose = () => console.log("WebSocket connection closed.");

    setWs(socket);

    return () => socket.close();
  }, [chat_id, access]);

  // Function to send messages
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: username, // Correct sender format (string)
      };

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(messageData));
      }

      // Update local messages with the correct sender format
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { content: newMessage, sender: username }, // sender as string
      // ]);

      setNewMessage("");
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-4">Chat</h1>

        <div className="bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl p-6 space-y-4 h-[70vh] overflow-hidden flex flex-col">
          {/* Loader while fetching messages */}
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto space-y-2 p-2">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center">No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === username ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender === username
                          ? "bg-gray-700 text-white self-start"
                          : "bg-blue-500 text-white self-end"
                      }`}
                    >
                      <span className="block font-semibold">
                        {msg.sender || "Unknown"} {/* FIXED sender display */}
                      </span>
                      <span>{msg.content || "..."}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Message input */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
