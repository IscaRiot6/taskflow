import { Link } from 'react-router-dom'
import '../styles/Welcome.css'

const Welcome = () => {
  return (
    <div className='welcome-container'>
      <h1>Welcome to My Task App</h1>
      <p>Organize your tasks easily and efficiently!</p>
      <Link to='/login'>
        <button className='start-btn'>Get Started</button>
      </Link>
    </div>
  )
}

export default Welcome
