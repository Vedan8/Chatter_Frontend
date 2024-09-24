import React, { useEffect, useRef, useState } from 'react';

export const Messages = (props) => {
    const chatId = props.chat_id;
    const access = props.access;
    const [messages, setMessages] = useState([]); // State to store messages
    const [messageInput, setMessageInput] = useState(''); // State for message input
    const messagesEndRef = useRef(null); // Reference to scroll to the latest message
    const socketRef = useRef(null); // Reference for WebSocket connection

    useEffect(() => {
        // Function to fetch past messages
        const fetchPastMsg = async () => {
            try {
                const response = await fetch(`https://chatter-backend-jy95.onrender.com/api/chats/${chatId}/messages/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                data.forEach((msgd) => {
                    appendMessage(msgd.content, msgd.sender.username);
                });

                // Establish WebSocket connection after fetching past messages
                socketRef.current = new WebSocket(`wss://chatter-backend-jy95.onrender.com/ws/chat/${chatId}/?token=${access}`);

                // Event listener for incoming messages
                socketRef.current.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data);
                    if (data.sender !== props.username) {
                        appendMessage(data.message, data.sender);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchPastMsg();

        return () => {
            if (socketRef.current) {
                socketRef.current.close(); // Clean up the WebSocket connection on component unmount
            }
        };
    }, [chatId, access]);

    // Function to append messages to the state
    const appendMessage = (message, sender) => {
        setMessages((prevMessages) => [...prevMessages, { message, sender }]);
        scrollToBottom();
    };

    // Function to scroll to the bottom of the messages
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Function to send a message to the server in JSON format
    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            const messageObj = { message: messageInput };
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
