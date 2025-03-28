import React, { useEffect, useState } from 'react'
import '../styles/LoginFormGenerator.css'
// import img1 from '../assets/loginFormGenerator/loginFormGeneratorImages1.jpg'
// import img2 from '../assets/loginFormGenerator/loginFormGeneratorImages2.jpg'
// import img3 from '../assets/loginFormGenerator/loginFormGeneratorImages3.jpg'
// import img4 from '../assets/loginFormGenerator/loginFormGeneratorImages4.jpg'
// import img5 from '../assets/loginFormGenerator/loginFormGeneratorImages5.jpg'
// import img6 from '../assets/loginFormGenerator/loginFormGeneratorImages6.png'
// import img7 from '../assets/loginFormGenerator/loginFormGeneratorImages7.jpg'
// import img8 from '../assets/loginFormGenerator/loginFormGeneratorImages8.jpg'
// import img9 from '../assets/loginFormGenerator/loginFormGeneratorImages9.png'
// import img10 from '../assets/loginFormGenerator/loginFormGeneratorImages10.jpeg'
// import img11 from '../assets/loginFormGenerator/loginFormGeneratorImages11.png'
// import img12 from '../assets/loginFormGenerator/loginFormGeneratorImages12.gif'
// import img13 from '../assets/loginFormGenerator/loginFormGeneratorImages13.png'
// import img14 from '../assets/loginFormGenerator/loginFormGeneratorImages14.jpg'
// import img15 from '../assets/loginFormGenerator/loginFormGeneratorImages15.png'
// import img16 from '../assets/loginFormGenerator/loginFormGeneratorImages16.jpg'
// import img17 from '../assets/loginFormGenerator/loginFormGeneratorImages17.jpg'
// import img18 from '../assets/loginFormGenerator/loginFormGeneratorImages18.png'
// import img19 from '../assets/loginFormGenerator/loginFormGeneratorImages19.jpeg'
// import img20 from '../assets/loginFormGenerator/loginFormGeneratorImages20.png'
// import img21 from '../assets/loginFormGenerator/loginFormGeneratorImages21.jpg'
import img1 from '../assets/signupImages/gifaki1.gif'
import img2 from '../assets/signupImages/gifaki2.gif'
import img3 from '../assets/signupImages/gifaki3.gif'
import img4 from '../assets/signupImages/gifaki4.gif'

const images = [
  img1,
  img2,
  img3,
  img4
  //   img5,
  //   img6,
  //   img7,
  //   img8,
  //   img9,
  //   img10,
  //   img11,
  //   img12,
  //   img13,
  //   img14,
  //   img15,
  //   img16,
  //   img17,
  //   img18,
  //   img19,
  //   img20,
  //   img21
]

const LoginFormGenerator = () => {
  const [backgroundImage, setBackgroundImage] = useState(null)

  useEffect(() => {
    // Select a random image on component mount
    const randomImage = images[Math.floor(Math.random() * images.length)]
    setBackgroundImage(randomImage)
  }, [])

  return (
    <div
      className='login-form-background'
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  )
}

export default LoginFormGenerator
