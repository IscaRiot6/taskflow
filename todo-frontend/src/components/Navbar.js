import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className='navbar'>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      {isLoggedIn ? (
        <button onClick={onLogout}>Log Out</button>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </nav>
  )
}

export default Navbar
