import React, { useEffect } from 'react'
import Home from '../components/Home'

const HomePage = ({ tasks, setTasks, handleEditTask }) => {
  // Add handleEditTask here
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('authToken') // Get the auth token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` // Add the token in Authorization header
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await response.json()
        console.log('Fetched tasks:', data) // Debugging log

        if (data && data.length > 0 && (!tasks || tasks.length === 0)) {
          setTasks(data) // Update the tasks only if they are not already set
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    if (!tasks || tasks.length === 0) {
      fetchTasks() // Fetch tasks only if tasks are empty
    }
  }, [tasks, setTasks]) // Include tasks in dependency array to check if it's updated

  return (
    <div>
      <Home tasks={tasks} setTasks={setTasks} handleEditTask={handleEditTask} />{' '}
      {/* Pass handleEditTask */}
    </div>
  )
}

export default HomePage
