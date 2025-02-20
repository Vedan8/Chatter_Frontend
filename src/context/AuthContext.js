import React, { createContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [access, setAccess] = useState('');
    const [username, setUsername] = useState('');
    const [chat_id, setChat_id] = useState('');

    return (
        <AuthContext.Provider value={{ email, setEmail, password, setPassword, otp, setOtp, access, setAccess, username, setUsername, chat_id, setChat_id }}>
            {children}
        </AuthContext.Provider>
    );
};
