import { useState, useEffect } from 'react'

import '../styles/About.css'
import { Typewriter } from 'react-simple-typewriter'
import FloatingTasks from './FloatingTasks'

const About = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(Math.floor(Math.random() * 100) + 1) // Generate random % each refresh
  }, [])

  return (
    <div className='about-container'>
      <FloatingTasks />
      <div className='about-header'>
        <h1>About My Task App</h1>
      </div>
      <div className='productivity-bar'>
        <p>Your Productivity Level: {progress}%</p>
        <div className='progress-container'>
          <div className='progress-bar' style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className='about-content'>
        <p className='typing-text'>
          <Typewriter
            words={[
              'Welcome to the Todo App! ✨',
              'Your tasks, organized effortlessly. ✅',
              'Track your progress with ease. 📊'
            ]}
            loop={false}
            cursor
            cursorStyle='_'
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={1000}
          />
        </p>
        <p>
          Built with React and Node.js, this app is simple, intuitive, and
          designed for quick usage.
        </p>
      </div>
      <div className='about-footer'>
        <p>&copy; 2025 My Todo App. All rights reserved.</p>
      </div>
    </div>
  )
}

export default About
