import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'

const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatData[chatIndex].updatedAt = Date.now();

            if(userChatData.chatData[chatIndex].rId === userData.id){
              userChatData.chatData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef,{
              chatData: userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  }

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if(hours > 12){
      return hours - 12 + ":" + minutes + "PM";
    }
    else{
      return hours + ":" + minutes + "AM";
    }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });
      return () => {
        unSub();
      }
    }
  }, [messagesId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  return chatUser ? (
    <div className={`chat-box ${chatVisible?"":"hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}</p>
        <img src={assets.help_icon} className='help' alt="" />
        <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
      </div>
      <div className="chat-msg">
        {messages.map((msg, index)=>(
          <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
          <p className="msg">
            {msg.text}
          </p>
          <div>
            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
            <p>{convertTimeStamp(msg.createdAt)}</p>
          </div>
        </div>
        ))}
      </div>
      <div className="chat-input">
        <input onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : <div className={`chat-welcome ${chatVisible?"":"hidden"}`}>
    <img src={assets.logo_icon} alt="" />
    <p>Chat anytime, anywhere</p>
  </div>
}

export default ChatBox
