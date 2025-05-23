import React from 'react'
import '../styles/WelcomeBanner.css'

const WelcomeBanner = ({ message, visible, onClose }) => {
  if (!visible) return null

  return (
    <div className='welcome-banner'>
      <p>{message}</p>
      <button className='close-btn' onClick={onClose}>
        ×
      </button>
    </div>
  )
}

export default WelcomeBanner
