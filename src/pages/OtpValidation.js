import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circles } from 'react-loader-spinner';

export const OtpValidation = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SetUsername = () => {
    navigate('/Username');
  };

  // OTP handling
  const [otp, setOtp] = useState(new Array(6).fill('')); // Adjust for the number of OTP digits
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus the next input box
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault(); // Prevent default backspace behavior

      const newOtp = [...otp];

      // Clear the current input
      newOtp[index] = '';
      setOtp(newOtp);

      // Move focus to the previous input if the current input is already empty
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    setLoading(true);

    try {
      const newdata = {
        email: props.useremail,
        otp: otp.join(''), // Combine OTP array into a single string
      };
      console.log('Submitting data:', newdata);

      const response = await fetch('https://chatter-backend-jy95.onrender.com/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newdata),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error response data:', responseData);
        throw new Error(JSON.stringify(responseData));
      }

      console.log('Response:', responseData);
      props.setAccess(responseData.access);
      SetUsername();

    } catch (error) {
      console.error('Error:', error);
    } finally {
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
          <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full flex flex-col">
            <div className="mb-4 flex justify-center gap-2">
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)} // Store input reference
                  className="w-10 h-10 border border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out cursor-pointer"
              >
                {loading ? <Circles color="white" height={20} width={20} /> : "Send Otp"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
