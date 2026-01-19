import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { chat_id, access, username } = useContext(AuthContext);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  // ✅ Fetch previous messages (memoized)
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://chatter-backend-jy95.onrender.com/api/chats/${chat_id}/messages/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      const formattedMessages = response.data.map((msg) => ({
        content: msg.content,
        sender: msg.sender.username,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [chat_id, access]);

  // ✅ Fetch messages + setup WebSocket
  useEffect(() => {
    fetchMessages();

    const socket = new WebSocket(
      `wss://chatter-backend-jy95.onrender.com/ws/chat/${chat_id}`
    );

    socket.onopen = () => console.log("WebSocket connected.");

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      if (receivedData?.message && receivedData?.sender) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: receivedData.message,
            sender: receivedData.sender,
          },
        ]);
      }
    };

    socket.onerror = (error) => console.error("WebSocket Error:", error);
    socket.onclose = () => console.log("WebSocket connection closed.");

    setWs(socket);

    return () => socket.close();
  }, [fetchMessages, chat_id]);

  // ✅ Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage,
      sender: username,
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(messageData));
    }

    setNewMessage("");
  };

  // ✅ Auto-scroll to latest message
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

      <div className="w-full max-w-2xl relative z-10">
        <h1 className="text-4xl font-bold text-center mb-4">Chat</h1>

        <div className="bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl p-6 space-y-4 h-[70vh] overflow-hidden flex flex-col">
          {/* Loader */}
          {loading ? (
            <div className="flex justify-center items-center">
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
                      msg.sender === username
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender === username
                          ? "bg-gray-700 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <span className="block font-semibold">
                        {msg.sender || "Unknown"}
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
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none"
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
