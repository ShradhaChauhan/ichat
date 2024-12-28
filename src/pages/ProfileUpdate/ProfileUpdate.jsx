import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import avatars from '../../assets/avatars'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [image, setImage] = useState(false);
  const {setUserData} = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Please select an avatar");
      }
      const docRef = doc(db, "users", uid);
      if(image) {
        setPrevImage(image);
        console.log(image);
        console.log(bio);
        console.log(uid);
        await updateDoc(docRef, {
          avatar: image,
          bio: bio,
          name: name
        }).then(docRef => {
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
        console.log(error);
    })
      }
      else {
        await updateDoc(docRef, {
          bio: bio,
          name: name
        })
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
    } catch (error) {
      console.log(error.code);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
          setImage(docSnap.data().avatar);
        }
      }
      else {
        navigate('/ichat');
      }
    })
  },[])

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h2>Profile Details</h2>
          <label htmlFor="avatar">
            <img src={image ? image : assets.avatar_icon} alt="" />           
          </label>
          <input type="text" onChange={(e) => { setName(e.target.value) }} value={name} placeholder='Your name' required />
          <textarea onChange={(e) => {setBio(e.target.value)}} value={bio} placeholder='Write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <div className='avatarList'>
          <h3>Choose your avatar</h3>
          <div className='profilePic'>
          {avatars.map((image) => (
            <img onClick={() => setImage(image.src) } className='avatar' key={image.id} src={image.src} alt={image.alt} />
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileUpdate
