import React from 'react'
import '../styles/WelcomeBanner.css'

const WelcomeBanner = ({ message, visible }) => {
  if (!visible) return null

  return (
    <div className='welcome-banner'>
      <p>{message}</p>
    </div>
  )
}

export default WelcomeBanner
