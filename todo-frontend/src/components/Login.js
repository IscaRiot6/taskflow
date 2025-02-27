// src/components/Login.js
import React, { useState } from 'react'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (username) {
      onLogin(username)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <h2>Login</h2>
      <input
        type='text'
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder='Enter username'
      />
      <button type='submit'>Login</button>
    </form>
  )
}

export default Login
