import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Signup from '../components/Signup'

const SignupPage = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async userData => {
    console.log('Sending Data:', userData)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        }
      )

      if (!response.ok) {
        const data = await response.json()
        console.log('Response Data:', data)
        throw new Error(data.message || 'Signup failed')
      }
      alert('Signup successful!')

      navigate('/login') // Redirect to login after successful signup
    } catch (err) {
      setError(err.message)
    }
  }

  return <Signup onSignup={handleSignup} error={error} />
}

export default SignupPage
