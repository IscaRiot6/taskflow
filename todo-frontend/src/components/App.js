import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import About from './About'
import Welcome from './Welcome'
import BackgroundSetter from './BackgroundSetter'
import Contact from './Contact'
import TaskDetails from './TaskDetails'
import RelatedTitles from './RelatedTitles'
import ThemeToggle from './ThemeToggle'
import '../styles/App.css'

function App () {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [theme, setTheme] = useState('default')
  const navigate = useNavigate() // Add useNavigate hook to navigate programmatically

  // Check if the user is already logged in on initial load (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsLoggedIn(true)
      // Optionally, set user info here (e.g., setUser(tokenUsername))
    } else {
      setTasks([]) // Clear tasks if no token is found
    }
  }, [])

  const handleLogin = username => {
    setIsLoggedIn(true)
    setUser(username) // Optionally store the username or other user data
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null) // Reset user on logout
    setTasks([]) // Clear tasks on logout
    localStorage.removeItem('authToken') // Clear the auth token from localStorage
    navigate('/login') // Redirect to login page after logout
  }

  // Edit task function
  const handleEditTask = async (
    id,
    newTitle,
    newDescription,
    newImage,
    newImage2,
    newGenres,
    newThemes,
    newScore
  ) => {
    try {
      const token = localStorage.getItem('authToken') // Get the auth token

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Add token to Authorization header
          },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            image: newImage,
            image2: newImage2,
            genres: newGenres,
            themes: newThemes,
            yourScore: newScore
          })
        }
      )

      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()
      console.log('Task updated successfully:', updatedTask) // Debugging log

      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === id ? updatedTask : task))
      )
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  return (
    <div className={`app theme-${theme}`}>
      <ThemeToggle setTheme={setTheme} />
      <BackgroundSetter />
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Welcome />} />{' '}
        {/* Make Welcome the main page */}
        <Route
          path='/home'
          element={
            <HomePage
              tasks={tasks}
              setTasks={setTasks}
              handleEditTask={handleEditTask}
            />
          }
        />
        <Route
          path='/task/:id'
          element={<TaskDetails tasks={tasks} onEdit={handleEditTask} />}
        />
        <Route
          path='/related-titles/:id'
          element={<RelatedTitles onAdd={handleEditTask} />}
        />
        <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
