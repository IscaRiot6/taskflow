import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar' // Adjust import if necessary
import Login from './Login'
import HomePage from '../pages/HomePage' // Correct the path here
import About from './About'
import Welcome from './Welcome'
import '../styles/App.css'
import BackgroundSetter from './BackgroundSetter'
import Contact from './Contact'
import TaskDetails from './TaskDetails'
import RelatedTitles from './RelatedTitles'

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

  // Edit task function
  const handleEditTask = async (
    id,
    newTitle,
    newDescription,
    newImage,
    newGenres,
    newThemes,
    newScore
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            image: newImage,
            genres: newGenres,
            themes: newThemes,
            yourScore: newScore
          })
        }
      )

      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()

      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === id ? updatedTask : task))
      )
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  return (
    <>
      <BackgroundSetter />
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route
          path='/'
          element={<HomePage tasks={tasks} setTasks={setTasks} />}
        />
        <Route
          path='/task/:id'
          element={<TaskDetails tasks={tasks} onEdit={handleEditTask} />}
        />
        <Route
          path='/related-titles/:id'
          element={<RelatedTitles onAdd={handleEditTask} />} // Pass handleEditTask to RelatedTitles as onAdd
        />

        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/about' element={<About />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
