import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PasswordValidation from './PasswordValidation'
import SignupCarousel from '../components/SignupCarousel'
import '../styles/Signup.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Signup = ({ onSignup, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false) // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // For confirm password toggle

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
            <div className='username-container'>
              <input
                type='text'
                name='username'
                placeholder='Username'
                onChange={handleChange}
                required
              />
            </div>
            <div className='email-container'>
              <input
                type='email'
                name='email'
                placeholder='Email'
                onChange={handleChange}
                required
              />
            </div>
            {/* Password field with the show/hide functionality */}
            <div className='password-container'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Password'
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='eye-icon'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {/* Password Validation Component */}
            <PasswordValidation password={formData.password} />
            {/* Confirm Password field with show/hide functionality */}
            <div className='password-container'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                placeholder='Confirm Password'
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='eye-icon'
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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
