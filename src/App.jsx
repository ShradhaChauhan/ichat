import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'

const App = () => {
  const { loadUserData } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user) {
        navigate("/chat");
        // navigate("/profile");
        await loadUserData(user.uid);
      }
      else {
        navigate("/");
      }
    })
  },[])
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route exact path = '/' element = {<Login/>} />
        <Route path = '/chat' element = {<Chat/>} />
        <Route path = '/profile' element = {<ProfileUpdate/>} />
      </Routes>
    </>
  )
}

export default App