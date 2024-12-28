import React, { useContext } from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSidebar = () => {

  const { chatUser } = useContext(AppContext);
  return chatUser ? (
    <div className='rs'>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}</h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <button onClick={() => logout()}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default RightSidebar
