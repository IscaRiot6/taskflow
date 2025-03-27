import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PasswordValidation from './PasswordValidation'
import SignupCarousel from '../components/SignupCarousel'
import '../styles/Signup.css'

const Signup = ({ onSignup, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Ensure password and confirm password match before submitting
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    onSignup(formData)
  }

  return (
    <div className='signup-wrapper'>
      <div className='signup-left'>
        <div className='signup-container'>
          <h2>Sign Up</h2>
          {error && <p className='error-message'>{error}</p>}
          <form className='signup-form' onSubmit={handleSubmit}>
            <input
              type='text'
              name='username'
              placeholder='Username'
              onChange={handleChange}
              required
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              onChange={handleChange}
              required
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              onChange={handleChange}
              required
            />
            {/* Password Validation Component */}
            <PasswordValidation password={formData.password} />
            <input
              type='password'
              name='confirmPassword'
              placeholder='Confirm Password'
              onChange={handleChange}
              required
            />
            <button type='submit'>Sign Up</button>
          </form>
          <p className='signup-link'>
            Already have an account? <Link to='/login'>Login here</Link>
          </p>
        </div>
      </div>
      <div className='signup-right'>
        <SignupCarousel />
      </div>
    </div>
  )
}

export default Signup
