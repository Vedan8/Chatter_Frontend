import './App.css';
import 'animate.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/components/LandingPage';
import Register from './pages/components/Register';
import Login from './pages/components/Login';
import Posts from './pages/components/Post';
import { AuthProvider } from './context/AuthContext';
import OtpValidation from './pages/components/OtpValidation';
import SetProfile from './pages/components/SetProfile';
import Chat from './pages/components/Chat';
import Messages from './pages/components/Messages';
import NewPost from './pages/components/NewPost';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (  
    <AuthProvider>
      <GoogleOAuthProvider clientId="839785403178-fhlf9mf98u29bg71m26kche4cq4o2bea.apps.googleusercontent.com">
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otpvalidate" element={<OtpValidation />} />
          <Route path="/setprofile" element={<SetProfile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/message" element={<Messages />} />
          <Route path="/new-post" element={<NewPost />} />
        </Routes>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
