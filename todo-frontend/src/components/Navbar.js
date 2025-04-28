import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/Navbar.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

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
      <Link to='/home'>Home</Link>
      <Link to='/favorites'>Favorites</Link>
      <Link to='/about'>About</Link>
      <Link to='/contact'>Contact</Link>
      <Link to='/profile'>Profile</Link>
      <Link to='/forum'>Forum</Link>
      {isLoggedIn ? (
        <button onClick={onLogout}>Log Out</button>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </nav>
  )
}

export default Navbar
