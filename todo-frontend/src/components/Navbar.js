import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/Navbar.css'

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      <Link to='/contact'>Contact</Link>
      {isLoggedIn ? (
        <button onClick={onLogout}>Log Out</button>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </nav>
  )
}

export default Navbar
