import React, { useState, useEffect } from 'react'

// Importing images
import img1 from '../assets/loginImages/loginImage1.png'
import img2 from '../assets/loginImages/loginImage17.jpg'
import img3 from '../assets/loginImages/loginImage3.jpg'
import img4 from '../assets/loginImages/loginImage4.jpg'
import img5 from '../assets/loginImages/loginImage5.jpg'
import img6 from '../assets/loginImages/loginImage6.jpg'
import img7 from '../assets/loginImages/loginImage7.jpg'
import img8 from '../assets/loginImages/loginImage8.jpg'
import img10 from '../assets/loginImages/loginImage10.jpg'
import img11 from '../assets/loginImages/loginImage11.jpg'
import img12 from '../assets/loginImages/loginImage12.jpg'
import img13 from '../assets/loginImages/loginImage13.jpg'
import img14 from '../assets/loginImages/loginImage14.jpg'
import img15 from '../assets/loginImages/loginImage15.jpg'

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,

  img10,
  img11,
  img12,
  img13,
  img14,
  img15
]

const RandomImageDisplay = () => {
  const [selectedImages, setSelectedImages] = useState([])

  useEffect(() => {
    // Shuffle without mutating original array
    const shuffled = [...images].sort(() => 0.5 - Math.random())
    setSelectedImages(shuffled.slice(0, 4))
  }, [])

  return (
    <div className='image-grid'>
      {selectedImages.map((img, index) => (
        <div key={index} className='grid-image-container'>
          <img src={img} alt={`Random ${index}`} className='grid-image' />
        </div>
      ))}
    </div>
  )
}

export default RandomImageDisplay
