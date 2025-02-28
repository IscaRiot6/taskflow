import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar' // Adjust import if necessary
import Login from './Login'
import Home from './Home'
import About from './About'
import Welcome from './Welcome'
import '../styles/App.css'
import BackgroundSetter from './BackgroundSetter' // Don't include 'components' as it is already in the same folder

function App () {
  const [tasks, setTasks] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Track login state

  const handleLogin = username => {
    // Set the username or any login logic
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    // Additional logout logic if needed
  }

  return (
    <>
      <BackgroundSetter />
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home tasks={tasks} setTasks={setTasks} />} />
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/about' element={<About />} />
        <Route path='/welcome' element={<Welcome />} />
      </Routes>
    </>
  )
}

export default App
