import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import SideNavbar from './SideNavbar' // Import Side Navbar
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import FavoritesPage from '../pages/FavoritesPage'
import ContactPage from '../pages/ContactPage'
import ProfilePage from '../pages/ProfilePage'
import About from './About'
import Welcome from './Welcome'
import BackgroundSetter from './BackgroundSetter'
import TaskDetails from './TaskDetails'
import RelatedTasks from './RelatedTasks'
import RelatedTaskDetails from './RelatedTaskDetails'
import ThemeToggle from './ThemeToggle'
import '../styles/App.css'
import { useCallback } from 'react'
import PrivateRoute from './PrivateRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ForumPage from '../pages/ForumPage'
// import 'bootstrap/dist/css/bootstrap.min.css'
import WelcomeBanner from './WelcomeBanner'

function App () {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [theme, setTheme] = useState('default')
  const navigate = useNavigate()
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  const memoizedSetTasks = useCallback(newTasks => {
    setTasks(newTasks)
  }, [])

  // Check if the user is already logged in on initial load (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userRaw = localStorage.getItem('user')

    try {
      const parsedUser = JSON.parse(userRaw)
      if (parsedUser && parsedUser._id) {
        setUser(parsedUser)
        setWelcomeMessage(`👋 Welcome back, ${parsedUser.username}!`)
        setShowWelcome(true)
        setTimeout(() => setShowWelcome(false), 4000)
      } else {
        throw new Error('Invalid user object')
      }
    } catch (err) {
      console.warn('⚠️ Could not parse user:', err)
      localStorage.removeItem('user')
    }

    if (token) {
      setIsLoggedIn(true)
    } else {
      setTasks([])
    }
  }, [])

  const handleLogin = user => {
    setIsLoggedIn(true)
    setUser(user)
    setWelcomeMessage(`👋 Welcome back, ${user.username}!`)
    setShowWelcome(true)
    setTimeout(() => setShowWelcome(false), 4000)
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
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        <ThemeToggle />
        <BackgroundSetter />
        <WelcomeBanner
          message={welcomeMessage}
          visible={showWelcome}
          onClose={() => setShowWelcome(false)}
        />
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <SideNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<Welcome />} />{' '}
          {/* Make Welcome the main page */}
          <Route
            path='/home'
            element={
              <PrivateRoute>
                <HomePage
                  tasks={tasks}
                  setTasks={setTasks}
                  handleEditTask={handleEditTask}
                />
              </PrivateRoute>
            }
          />
          <Route
            path='/task/:id'
            element={
              <PrivateRoute>
                <TaskDetails tasks={tasks} onEdit={handleEditTask} />
              </PrivateRoute>
            }
          />
          <Route
            // EDW KOITAKSE
            path='/related-titles/:taskId'
            element={
              <PrivateRoute>
                <RelatedTasks tasks={tasks} onAdd={handleEditTask} />
              </PrivateRoute>
            }
          />
          <Route
            path='/related-task-details/:relatedId'
            element={
              // <PrivateRoute>
              <RelatedTaskDetails />
              // </PrivateRoute>
            }
          />
          <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route
            path='/favorites'
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/forum'
            element={
              <PrivateRoute>
                <ForumPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App
