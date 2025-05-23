import React, { useState, useEffect } from 'react'
import '../styles/Contact.css' // Import styles

const images = [
  require('../assets/slideshowImages/slideshowImage1.jpg'),
  require('../assets/slideshowImages/slideshowImage2.png'),
  require('../assets/slideshowImages/slideshowImage3.jpg'),
  require('../assets/slideshowImages/slideshowImage4.jpeg'),
  require('../assets/slideshowImages/slideshowImage5.png'),
  require('../assets/slideshowImages/slideshowImage6.jpg'),
  require('../assets/slideshowImages/slideshowImage7.png'),
  require('../assets/slideshowImages/slideshowImage8.jpg'),
  require('../assets/slideshowImages/slideshowImage9.jpeg'),
  require('../assets/slideshowImages/slideshowImage10.png'),
  require('../assets/slideshowImages/slideshowImage11.jpg'),
  require('../assets/slideshowImages/slideshowImage12.png'),
  require('../assets/slideshowImages/slideshowImage13.jpg'),
  require('../assets/slideshowImages/slideshowImage14.jpeg'),
  require('../assets/slideshowImages/slideshowImage15.jpg'),
  require('../assets/slideshowImages/slideshowImage16.png'),
  require('../assets/slideshowImages/slideshowImage17.jpg'),
  require('../assets/slideshowImages/slideshowImages10.jpeg'),
  require('../assets/slideshowImages/slideshowImages12.jpg'),
  // require('../assets/slideshowImages/slideshowImages13.png'),
  require('../assets/slideshowImages/slideshowImages13.jpg'),
  require('../assets/slideshowImages/slideshowImages14.jpg'),
  require('../assets/slideshowImages/slideshowImages15.jpg'),
  require('../assets/slideshowImages/slideshowImages18.jpeg'),
  // require('../assets/slideshowImages/slideshowImage19.jpg'),
  require('../assets/slideshowImages/slideshowImages77.png')
]

const Contact = ({ onSubmitContactForm }) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  // State for message sent notification
  const [messageSent, setMessageSent] = useState(false)

  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Handle form input change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()

    const contactData = {
      name: formData.name,
      email: formData.email,
      message: formData.message
    }

    try {
      // Sending the form data to the backend
      await onSubmitContactForm(contactData)
      setFormData({ name: '', email: '', message: '' }) // Reset form
      setMessageSent(true) // Show success message
    } catch (error) {
      console.error('Error sending message:', error)
      setMessageSent(false) // If there's an error, don't show the success message
    }

    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessageSent(false)
    }, 3000)
  }

  // Auto slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [])

  // Function to manually go to the next image
  const nextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
  }

  // Function to manually go to the previous image
  const prevImage = () => {
    setCurrentImageIndex(
      prevIndex => (prevIndex - 1 + images.length) % images.length
    )
  }

  return (
    <>
      <div>
        <h1 className='contact-title'>Contact Me</h1>
        <p className='contact-subtitle'>
          Got feedback, ideas, or just want to say hi? Fill out the form below
          and I’ll get back to you!
        </p>
      </div>
      <div className='contact-container'>
        {/* Left Panel - Form */}
        <div className='contact-form'>
          <h2 className='get-in-touch-contact'>Get in Touch</h2>
          <p className='welcome-message-contact'>
            Feel free to drop a message! I'll get back to you as soon as
            possible.
          </p>
          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <p className='input-label'>
                Place your name here <span className='arrow'>↓</span>
              </p>
              <input
                type='text'
                name='name'
                placeholder='Your Name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='input-group'>
              <p className='input-label'>
                Enter your email <span className='arrow'>↓</span>
              </p>
              <input
                type='email'
                name='email'
                placeholder='Your Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='input-group'>
              <p className='input-label'>
                Write your message below <span className='arrow'>↓</span>
              </p>
              <textarea
                name='message'
                placeholder='Your Message'
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type='submit' className='contact-form-button'>
              Send Message
            </button>
          </form>

          {/* Display "Message Sent" after successful form submission */}
          {messageSent && (
            <div className='message-sent visible'>
              Message Sent Successfully!
            </div>
          )}
        </div>

        {/* Right Panel - Slideshow with navigation buttons */}
        <div className='contact-slideshow'>
          <button className='prev-button' onClick={prevImage}>
            &#10094;
          </button>
          <img src={images[currentImageIndex]} alt='Slideshow' />
          <button className='next-button' onClick={nextImage}>
            &#10095;
          </button>
        </div>
      </div>
    </>
  )
}

export default Contact
