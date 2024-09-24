import { useNavigate } from 'react-router-dom';

export const Landing=()=>{
    const navigate = useNavigate();
    const SignUpButton=()=>{
        navigate('/SignUp')
    }
    const LoginButton=()=>{
        navigate('/Login')
    }
    return (
        <div className="bg-cyan-100 h-[100vh] w-[100vw] flex justify-center ">
            <div className="bg-cyan-50 h-[90vh] w-[90vw] m-auto rounded-2xl shadow-xl ">
                {/* NavBar */}
                <div className="flex relative mt-2 items-center">
                    <div className="absolute left-5 text-lg font-serif">Chatter</div>
                    <div className="flex m-auto gap-5">
                        <p className="font-semibold text-gray-500">Home</p>
                        <p className="font-semibold text-gray-500">Chat</p>
                    </div>
                    <div className="absolute right-5 flex gap-3">
                        <button onClick={LoginButton} className="bg-slate-200 px-5 py-1 rounded-2xl text-gray-700 font-semibold text-sm ">Login</button>
                        <button onClick={SignUpButton} className="bg-yellow-500 px-5 py-1 rounded-2xl text-yellow-50 text-sm">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}