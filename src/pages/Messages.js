import React, { useEffect, useRef, useState } from 'react';

export const Messages = (props) => {

    const chatId = props.chat_id;
    const access = props.access;
    const [messages, setMessages] = useState([]); // State to store messages
    const [messageInput, setMessageInput] = useState(''); // State for message input
    const messagesEndRef = useRef(null); // Reference to scroll to the latest message
    const socketRef = useRef(null); // Reference for WebSocket connection

    useEffect(() => {
        // Establish a WebSocket connection to the server
        const fetchpastMsg = async () => {
    
          try {
            const response = await fetch(`https://chatter-backend-jy95.onrender.com/api/chats/${chatId}/messages/`, {
              method: 'GET', // Method can be GET or POST depending on the API
              headers: {
                'Authorization': `Bearer ${access}`, // Set Bearer token in headers
                'Content-Type': 'application/json', // Set content type if needed
              },
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok'); // Handle HTTP errors
            }
    
            const data = await response.json(); 
            console.log(data)
            data.map((msgd)=>{
                appendMessage(msgd.content,msgd.sender.username)
                return (
                    console.log(msgd.content,msgd.sender.username)
                )
            })
          }
          catch(err){
            console.log(err)
          }
        };
        fetchpastMsg();
        socketRef.current = new WebSocket(`ws://chatter-backend-jy95.onrender.com/ws/chat/${chatId}/?token=${access}`);

        // Function to append messages to the state
        const appendMessage = (message, sender) => {
            setMessages((prevMessages) => [...prevMessages, { message, sender }]);
            scrollToBottom()
        };

        // Event listener for incoming messages
        socketRef.current.addEventListener('message', (event) => {
            const data = JSON.parse(event.data); // Parse incoming JSON data
            if (data.sender!==props.username){
              appendMessage(data.message, data.sender); // Add sender info for styling
            }
        });

        return () => {
            socketRef.current.close(); // Clean up the WebSocket connection on component unmount
        };
    }, [chatId, access]);

    // Function to scroll to the bottom of the messages
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Function to send a message to the server in JSON format
    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            const messageObj = { message: messageInput }; // Create message object
            socketRef.current.send(JSON.stringify(messageObj)); // Send JSON object
            setMessages((prevMessages) => [...prevMessages, { message: messageInput, sender: props.username }]); // Append your message
            setMessageInput(''); // Clear the input field
            scrollToBottom(); // Scroll to the bottom after sending
        }
    };

    // Allow sending message by pressing Enter key
    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="bg-cyan-100 min-h-screen w-screen flex justify-center items-center">
            <div className="bg-cyan-50 h-[90vh] w-[90vw] rounded-2xl shadow-xl p-6 flex flex-col">
                <h1 className="text-lg font-serif">Chat</h1>
                <div id="messages" className="flex-grow overflow-auto mt-2 border border-gray-300 p-2">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`p-2 my-1 rounded-xl ${msg.sender === props.username ? 'bg-blue-300 ml-auto' : 'bg-gray-200'} w-fit`}
                        >
                            
                            {msg.message}
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                </div>
                <div id="inputArea" className="flex mt-4">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)} // Update input state
                        onKeyUp={handleKeyUp}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 p-2"
                    />
                    <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
