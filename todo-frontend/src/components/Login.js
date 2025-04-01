import React, { useState } from 'react'
import '../styles/Login.css'
import RandomImageDisplay from './RandomImageDisplay'
import { Link } from 'react-router-dom'
import LoginFormGenerator from './LoginFormGenerator'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (username && password) {
      onLogin(username, password) // Pass both username and password
    } else {
      setErrorMessage('Please enter both username and password.')
    }
  }

  return (
    <div className='login-container'>
      <div className='login-left'>
        <RandomImageDisplay />
      </div>
      <div className='login-right'>
        <div className='login-right-box'></div>
        <LoginFormGenerator />
        <form onSubmit={handleSubmit} className='login-form'>
          <h2 className='login-title'>Welcome Back</h2>
          <div className='username-container'>
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder='Enter username'
            />
          </div>
          {/* Password field with the show/hide functionality */}
          <div className='password-container'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter password'
            />
            <span
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='eye-icon'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <button type='submit'>Login</button>
          <p className='signup-link'>
            You haven't signed up yet?{' '}
            <Link to='/signup'>Click here to sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
