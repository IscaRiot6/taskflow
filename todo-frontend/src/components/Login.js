import React, { useState } from 'react'
import '../styles/Login.css'
import RandomImageDisplay from './RandomImageDisplay'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (username) {
      onLogin(username)
    }
  }

  return (
    <div className='login-container'>
      {/* Left Panel - Image Grid */}
      <div className='login-left'>
        <RandomImageDisplay />
      </div>

      {/* Right Panel - Login Form */}
      <div className='login-right'>
        {/* Accent Box Behind the Form */}
        <div className='login-right-box'></div> {/* Add the box here */}
        <form onSubmit={handleSubmit} className='login-form'>
          <h2 className='login-title'>Welcome Back</h2>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Enter username'
          />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
