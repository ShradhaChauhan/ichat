import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom'
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
      if (user) {
        navigate("/chat");
        // navigate("/profile");
        await loadUserData(user.uid);
      }
      else {
        navigate("/ichat");
      }
    })
  }, [])
  return (
    <>
      <BrowserRouter basename="/ichat">
        <ToastContainer />
        <Routes>
          <Route exact path='/ichat' element={<Login />}></Route>
          <Route path='/chat' element={<Chat />}></Route>
          <Route path='/profile' element={<ProfileUpdate />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
