import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login, resetPass } from '../../config/firebase'

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentState === "Sign up") {
      signup(username, email, password);
    }
    else {
      login(email, password);
    }
  }
  return (
    <div className='login'>
      <img src={assets.logo_big} alt="login page image" className="logo" />
      <form onSubmit={onSubmitHandler} action="" className="login-form">
        <h2>{currentState}</h2>
        {currentState === "Sign up" ? <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder='Username' className="form-input" required /> : null}
        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email Address' className="form-input" required />
        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Password' className="form-input" required />
        <button type='submit'>{currentState === "Sign up" ? "Create Account" : "Login"}</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {currentState === "Sign up"
            ? <p className="login-toggle">
              Have an account? <span onClick={() => setCurrentState("Login")}>Log in</span>
            </p>
            : <p className="login-toggle">
              Don't have an account? <span onClick={() => setCurrentState("Sign up")}>Sign up</span>
            </p>
          }
          {currentState === "Login" 
          ? <p className="login-toggle">
          Forgot Password? <span onClick={() => resetPass(email)}>reset here</span>
        </p>
        : null
        }
        </div>
      </form>
    </div>
  )
}

export default Login
