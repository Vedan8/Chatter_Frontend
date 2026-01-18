import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const OtpValidation = () => {
  const { otp, setOtp, email , setAccess} = useContext(AuthContext);
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/, ""); // Allow only numbers

    if (value) {
      const newOtp = [...otpArray];
      newOtp[index] = value;
      setOtpArray(newOtp);
      setOtp(newOtp.join("")); // Update OTP in context

      // Move to next input if available
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otpArray[index]) {
        // Clear current input
        const newOtp = [...otpArray];
        newOtp[index] = "";
        setOtpArray(newOtp);
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        inputRefs.current[index - 1].focus();
        const newOtp = [...otpArray];
        newOtp[index - 1] = "";
        setOtpArray(newOtp);
        setOtp(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "").split("");
    if (pasteData.length === 6) {
      setOtpArray(pasteData);
      setOtp(pasteData.join(""));
      inputRefs.current[5].focus(); // Move focus to the last input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtp();
  };

  const sendOtp = async () => {
    setLoading(true); // Show loader while OTP is being sent
    try {
      console.log('Sending OTP with:', { email: email, otp });
      const response = await axios.post("https://chatter-backend-jy95.onrender.com/api/verify-otp/", { email: email, otp });
      console.log(response.data);
      setAccess(response.data.access);
      navigate('/setprofile');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Hide loader after OTP verification
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
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
      <div className="container text-center px-8 py-16 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-2xl animate-fadeIn max-w-2xl relative z-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          OTP Validation
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 animate-fadeIn">
          An OTP has been sent to your email: {email}.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 animate-fadeIn">
          <div className="flex justify-center space-x-2" onPaste={handlePaste}>
            {otpArray.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-8 h-8 sm:w-12 sm:h-12 text-center border bg-gray-800 text-white rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center mt-4">
              <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 shadow-lg transition-transform transform hover:scale-105"
            >
              Validate
            </button>
          )}
        </form>
      </div>

      <footer className="mt-10 text-gray-400 text-sm animate-fadeIn text-center relative z-10">
        &copy; 2025 Chatter. All rights reserved.
      </footer>
    </div>
  );
};

export default OtpValidation;
