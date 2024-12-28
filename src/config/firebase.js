// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtWUnMQeMTC9dgkJst6FIwUWn1mtPFbJM",
  authDomain: "ichat-x.firebaseapp.com",
  projectId: "ichat-x",
  storageBucket: "ichat-x.firebasestorage.app",
  messagingSenderId: "179548378717",
  appId: "1:179548378717:web:3113043debd2f3952a9fb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, there I'm using ichat",
            lastSeen: Date.now()
        });
        await setDoc(doc(db, "chats", user.uid), {
            chatData: []
        })
        toast.success("User created successfully");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass = async (email) => {
    if(!email){
        toast.error("Please enter your Email");
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent Successfully");
        }
        else{
            toast.error("Email doesn't exists");
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
}

export {signup, login, logout, auth, db, resetPass}