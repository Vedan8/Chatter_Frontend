import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { Landing } from './pages/Landing';
import { SignUp } from './pages/SignUp';
import { OtpValidation } from './pages/OtpValidation';
import { Login } from './pages/Login';
import { useState } from 'react';
import { Username } from './pages/Username';
import { Post } from './pages/Post';
import { Chat } from './pages/Chat';
import { Messages } from './pages/Messages';

function App() {
  const [useremail,setUseremail]=useState("")
  const [access,setAccess]=useState("")
  const [chat_id,setChat_id]=useState("")
  const [username,setUsername]=useState("")
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='' element={<Landing/>}/>
          <Route path='SignUp' element={<SignUp setUseremail={setUseremail} />}/>
          <Route path='Login' element={<Login setAccess={setAccess} setUsername={setUsername} />}/>
          <Route path='OtpValidation' element={<OtpValidation useremail={useremail} setAccess={setAccess} />}/>
          <Route path='Username' element={<Username access={access} />}/>
          <Route path='Posts' element={<Post access={access} />}/>
          <Route path='Chats' element={<Chat access={access} setChat_id={setChat_id} />}/>
          <Route path='Messages' element={<Messages access={access} chat_id={chat_id} username={username} />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
