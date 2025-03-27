import React, { useState } from 'react'
import '../styles/Login.css'
import RandomImageDisplay from './RandomImageDisplay'
import { Link } from 'react-router-dom'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
        <form onSubmit={handleSubmit} className='login-form'>
          <h2 className='login-title'>Welcome Back</h2>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Enter username'
          />
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Enter password'
          />
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
