// src/pages/HomePage.js
import React, { useEffect } from 'react'
import Home from '../components/Home'

const HomePage = ({ tasks, setTasks }) => {
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks`
        )
        const data = await response.json()
        console.log('Fetched tasks:', data) // Debugging log
        if (tasks.length === 0) {
          setTasks(data)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
  }, [tasks, setTasks])

  return (
    <div>
      <h1>Welcome to the Task Manager</h1>
      <Home tasks={tasks} setTasks={setTasks} />
    </div>
  )
}

export default HomePage
