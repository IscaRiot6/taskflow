import React, { useEffect } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

const Home = ({ tasks, setTasks }) => {
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
  }, [setTasks])

  // Add task
  const handleAddTask = async title => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        }
      )
      const addedTask = await response.json()
      setTasks(prevTasks => [...prevTasks, addedTask]) // Use functional update
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Edit task
  const handleEditTask = async (id, newTitle) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle })
        }
      )
      const updatedTask = await response.json()
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === id ? updatedTask : task))
      )
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  // Delete task
  const handleDeleteTask = async id => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div>
      <h1>My Task List</h1>
      <TaskForm onAdd={handleAddTask} />
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />
    </div>
  )
}

export default Home
