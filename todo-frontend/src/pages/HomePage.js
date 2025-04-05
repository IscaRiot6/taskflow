import React, { useEffect } from 'react'
import Home from '../components/Home'

const HomePage = ({ tasks, setTasks, handleEditTask }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log('🟢 Freshly fetched task count:', data.length)

        setTasks(data)
        localStorage.setItem('tasks', JSON.stringify(data))
      } catch (error) {
        console.error('🔴 Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, []) // ← no dependency, run once

  return (
    <div>
      <Home tasks={tasks} setTasks={setTasks} handleEditTask={handleEditTask} />{' '}
      {/* Pass handleEditTask */}
    </div>
  )
}

export default HomePage
