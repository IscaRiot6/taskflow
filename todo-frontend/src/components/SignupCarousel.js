import '../styles/SignupCarousel.css'
import React, { useState, useEffect } from 'react'
import img1 from '../assets/signupImages/signupImage1.jpg'
import img3 from '../assets/signupImages/signupImage3.png'
import img4 from '../assets/signupImages/signupImage4.png'
import img5 from '../assets/signupImages/signupImage5.png'
import img6 from '../assets/signupImages/signupImage6.png'
import img7 from '../assets/signupImages/signupImage7.png'
import img8 from '../assets/signupImages/signupImage8.jpg'
import img9 from '../assets/signupImages/signupImage9.jpeg'
import img10 from '../assets/signupImages/signupImage10.jpg'
import img11 from '../assets/signupImages/signupImage11.jpg'
import img12 from '../assets/signupImages/signupImage12.png'
import img13 from '../assets/signupImages/signupImage13.png'
import img14 from '../assets/signupImages/signupImage14.jpg'
import img15 from '../assets/signupImages/signupImage15.jpg'
import img16 from '../assets/signupImages/signupImage16.jpeg'
import img17 from '../assets/signupImages/signupImage17.jpeg'
import img18 from '../assets/signupImages/signupImage18.jpg'
import img19 from '../assets/signupImages/signupImage19.jpg'
import img20 from '../assets/signupImages/signupImage20.png'
import img21 from '../assets/signupImages/signupImage21.jpg'
import img22 from '../assets/signupImages/signupImage22.png'
import img24 from '../assets/signupImages/signupImage24.jpeg'
import img23 from '../assets/signupImages/signupImage23.jpeg'
import img25 from '../assets/signupImages/signupImage25.png'
import img27 from '../assets/signupImages/signupImage27.jpg'
import img28 from '../assets/signupImages/signupImage28.jpeg'
import img29 from '../assets/signupImages/signupImage29.png'
import img30 from '../assets/signupImages/signupImage30.png'
import img31 from '../assets/signupImages/signupImage31.png'
import img32 from '../assets/signupImages/signupImage32.jpg'
import img33 from '../assets/signupImages/signupImage33.jpg'
import img34 from '../assets/signupImages/signupImage34.jpg'
import img36 from '../assets/signupImages/signupImage36.png'
import img38 from '../assets/signupImages/signupImage38.jpg'
import img39 from '../assets/signupImages/signupImage39.png'
import img40 from '../assets/signupImages/signupImage40.jpg'
import img41 from '../assets/signupImages/signupImage41.jpg'
import img42 from '../assets/signupImages/signupImage42.png'
import img44 from '../assets/signupImages/signupImage44.jpg'
import img46 from '../assets/signupImages/signupImage46.jpg'
import img47 from '../assets/signupImages/signupImage47.jpg'
import img48 from '../assets/signupImages/signupImage48.jpg'
import img49 from '../assets/signupImages/signupImage49.jpg'
import img50 from '../assets/signupImages/signupImage50.jpg'
import img51 from '../assets/signupImages/signupImage51.jpg'
import img52 from '../assets/signupImages/signupImage52.jpg'
import img53 from '../assets/signupImages/signupImage53.png'
import img54 from '../assets/signupImages/signupImage54.png'

const SignupCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    img1,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img17,
    img18,
    img19,
    img20,
    img21,
    img22,
    img23,
    img24,
    img25,
    img27,
    img28,
    img29,
    img30,
    img31,
    img32,
    img33,
    img34,
    img36,
    img38,
    img39,
    img40,
    img41,
    img42,
    img44,
    img46,
    img47,
    img48,
    img49,
    img50,
    img51,
    img52,
    img53,
    img54
  ]
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return // Pause auto-scroll when hovered

    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(intervalId) // Cleanup
  }, [isHovered])

  // 🔹 Move to Previous Image
  const prevSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  // 🔹 Move to Next Image
  const nextSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div
      className='signup-carousel'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className='prev-button' onClick={prevSlide}>
        ‹
      </button>
      <img src={images[currentImageIndex]} alt='carousel' />
      <button className='next-button' onClick={nextSlide}>
        ›
      </button>
    </div>
  )
}

export default SignupCarousel
