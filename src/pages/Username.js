import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Circles } from 'react-loader-spinner';

export const Username=(props)=>{
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const LoginButton=()=>{
        navigate('/Login')
    }
    const schema=yup.object().shape({
        username:yup.string().required(),
    })
    const {register,handleSubmit,formState:{errors}} =useForm({
        resolver:yupResolver(schema)
    })
    const [serverError, setServerError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const onSubmit = async (data) => {
        setLoading(true); 
        try {
            setServerError(null);
            setSuccessMessage(null);
            console.log('Submitting data:', data);

            const response = await fetch('https://chatter-backend-jy95.onrender.com/api/update-username/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.access}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('Error response data:', responseData);
                throw new Error(JSON.stringify(responseData));
            }
            console.log('Response:', responseData);
            LoginButton()
            setSuccessMessage('Username Updated');

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
                        <p className="font-semibold text-gray-500 cursor-pointer">Home</p>
                        <p className="font-semibold text-gray-500 cursor-pointer">Chat</p>
                    </div>
                    <div className="absolute right-5 flex gap-3">
                        <button className="bg-slate-200 px-5 py-1 rounded-2xl text-gray-700 font-semibold text-sm">Login</button>
                        <button className="bg-yellow-500 px-5 py-1 rounded-2xl text-yellow-50 text-sm">Sign Up</button>
                    </div>
                </div>

                <div className="flex-grow flex items-center justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full flex flex-col">
                <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Username..."
                                {...register('username')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.username && (
                                <span className="text-red-500 text-sm">{errors.username.message}</span>
                            )}
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out cursor-pointer"
                            >
                                {loading ? <Circles color="white" height={20} width={20} /> : "Done"}
                            </button>
                        </div>
                </form>
                </div>
            </div>
        </div>
    )
}