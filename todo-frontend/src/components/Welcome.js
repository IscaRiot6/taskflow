import { Link } from 'react-router-dom'
import '../styles/Welcome.css'
import image1 from '../assets/images/image1.jpeg'
import image3 from '../assets/images/image3.jpg'
import image4 from '../assets/images/image4.jpeg'
import image5 from '../assets/images/image5.jpeg'
import image6 from '../assets/images/image7.jpeg'

const Welcome = () => {
  return (
    <div className='welcome-container'>
      <div className='content-wrapper'>
        {' '}
        {/* New wrapper */}
        <div className='left-panel'>
          <div className='mini-frame'>
            <img src={image1} alt='Description 1' className='mini-image' />
            <img src={image3} alt='Description 2' className='mini-image' />
          </div>
          <div className='mini-frame'>
            <img src={image4} alt='Description 3' className='mini-image' />
            <img src={image5} alt='Description 4' className='mini-image' />
          </div>
          <div className='welcome-message welcome-header'>
            <h1>Welcome to My Task App</h1>
          </div>
        </div>
        <div className='right-panel'>
          <div className='banner'>
            <img src={image6} alt='Banner' className='banner-image' />
          </div>
          <div className='welcome-message'>
            <p>
              Organize your tasks efficiently and stay productive. Get started
              by{' '}
              <Link to='/login' className='login-button hyperlink'>
                Logging in
              </Link>{' '}
              or learn more on our{' '}
              <Link to='/about' className='hyperlink'>
                About
              </Link>{' '}
              and{' '}
              <Link to='/contact' className='hyperlink'>
                Contact
              </Link>{' '}
              pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
