import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Circles } from 'react-loader-spinner';

export const Login = (props) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const SignUpButton=()=>{
        navigate('/')
    }
    const postNavigate=()=>{
        navigate('/Chats')
    }
    const schema = yup.object().shape({
        email: yup
            .string()
            .email('Invalid email address')
            .required('Email is required'),
        password: yup
            .string()
            .min(4, 'Password must be at least 4 characters')
            .max(20, 'Password cannot exceed 20 characters')
            .required('Password is required'),
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [serverError, setServerError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true); 
        try {
            setServerError(null);
            setSuccessMessage(null);

            console.log('Submitting data:', data);

            const response = await fetch('https://chatter-backend-jy95.onrender.com/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('Error response data:', responseData);
                throw new Error(JSON.stringify(responseData));
            }

            console.log('Response:', responseData);
            props.setAccess(responseData.access)
            props.setUsername(responseData.username)
            postNavigate()
            setSuccessMessage('Login successful!');
            reset();
        } catch (error) {
            console.error('Error:', error);
            setServerError(error.message || 'An unexpected error occurred.');
        }
        finally {
            setLoading(false); 
          }
    };

    return (
        <div className="bg-cyan-100 h-screen w-screen flex justify-center items-center">
            <div className="bg-cyan-50 h-[90vh] w-[90vw] rounded-2xl shadow-xl p-6 flex flex-col">
                {/* NavBar */}
                <div className="flex relative mt-2 items-center">
                    <div className="absolute left-5 text-lg font-serif">Chatter</div>
                    <div className="flex m-auto gap-5">
                    </div>
                    <div className="absolute right-5 flex gap-3">
                        <button className="bg-slate-200 px-5 py-1 rounded-2xl text-gray-700 font-semibold text-sm">Login</button>
                        <button onClick={SignUpButton} className="bg-yellow-500 px-5 py-1 rounded-2xl text-yellow-50 text-sm">Sign Up</button>
                    </div>
                </div>

                {/* Register Form */}
                <div className="flex-grow flex items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full flex flex-col">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                        {/* Email Field */}
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email..."
                                {...register('email')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">{errors.email.message}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password..."
                                {...register('password')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">{errors.password.message}</span>
                            )}
                        </div>

                        {/* Server Error Message */}
                        {serverError && (
                            <div className="mb-4 text-red-500 text-sm text-center">
                                <pre>{serverError}</pre>
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 text-green-500 text-sm text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out cursor-pointer"
                            >
                                {loading ? <Circles color="white" height={20} width={20} /> : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
