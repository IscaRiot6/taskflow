import React, { useEffect } from 'react'
import { backgroundImages } from './backgroundImages' // Import the image array

const BackgroundSetter = () => {
  // Function to randomly pick a background image
  const setRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length) // Get random image index
    const randomImage = backgroundImages[randomIndex]
    document.body.style.background = `url(${randomImage}) no-repeat center center fixed`
    document.body.style.backgroundSize = 'cover'
  }

  // Set background when the component mounts
  useEffect(() => {
    setRandomBackground()
  }, []) // Only run once on initial render

  return null // No need to render anything, just apply styles globally
}

export default BackgroundSetter
