import React, { useState } from 'react'
import Login from '../components/Login'
import { useNavigate } from 'react-router-dom'

const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (username, password) => {
    // EDW TO EPISMO TO KALO EEEEEEEEEE
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to login')
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.token)

      // **Debugging**
      console.log('After setting token:', localStorage.getItem('authToken')) // Check if token is set before navigating.

      onLogin(data.username)

      // Redirect to home page after successful login
      console.log(localStorage.getItem('token')) // CONSOLE LOG FOR TOKEN
      navigate('/home')
    } catch (error) {
      console.error('Error logging in:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Login onLogin={handleLogin} />
      {isLoading && <p>Loading...</p>}
      {error && <p className='error-message'>{error}</p>}
    </div>
  )
}

export default LoginPage
