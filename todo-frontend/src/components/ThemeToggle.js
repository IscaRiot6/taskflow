import React from 'react'
import '../styles/ThemeToggle.css'

const ThemeToggle = ({ setTheme }) => {
  return (
    <div className='theme-toggle-container'>
      <button className='theme-btn default' onClick={() => setTheme('default')}>
        Default
      </button>
      <button className='theme-btn black' onClick={() => setTheme('black')}>
        Black
      </button>
      <button className='theme-btn purple' onClick={() => setTheme('purple')}>
        Purple
      </button>
    </div>
  )
}

export default ThemeToggle
