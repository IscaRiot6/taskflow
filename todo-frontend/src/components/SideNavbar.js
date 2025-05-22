import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/SideNavbar.css'
import {
  FaHome,
  FaHeart,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaRocketchat
} from 'react-icons/fa' // Example icons

const SideNavbar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`side-navbar ${isOpen ? 'open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <nav>
        <ul>
          <li>
            <Link to='/home'>
              <FaHome /> <span className='nav-text'>Home</span>
            </Link>
          </li>
          <li>
            <Link to='/favorites'>
              <FaHeart /> <span className='nav-text'>Favorites</span>
            </Link>
          </li>
          <li>
            <Link to='/about'>
              <FaInfoCircle /> <span className='nav-text'>About</span>
            </Link>
          </li>

          <li>
            <Link to='/contact'>
              <FaEnvelope /> <span className='nav-text'>Contact</span>
            </Link>
          </li>
          <li>
            <Link to='/profile'>
              <FaUserCircle /> <span className='nav-text'>Profile</span>
            </Link>
          </li>
          <li>
            <Link to='/forum'>
              <FaRocketchat /> <span className='nav-text'>Forum</span>
            </Link>
          </li>

          {isLoggedIn && (
            <li onClick={onLogout} className='logout'>
              <FaSignOutAlt /> <span className='nav-text'>Logout</span>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default SideNavbar
