import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './Login' // Import Login component
import Home from './Home' // Import Home component
import TaskForm from './TaskForm' // Import TaskForm component
import TaskList from './TaskList' // Import TaskList component
import LoginPage from '../pages/LoginPage'

function App () {
  const [tasks, setTasks] = useState([])

  // Fetch tasks from backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks`
        )
        const data = await response.json()
        console.log('Fetched tasks:', data)
        setTasks(data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [])

  // Function to add a new task
  const handleAddTask = async title => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        }
      )
      const addedTask = await response.json()
      setTasks([...tasks, addedTask])
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Function to edit a task
  const handleEditTask = async (id, newTitle) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newTitle })
        }
      )
      const updatedTask = await response.json()
      setTasks(tasks.map(task => (task._id === id ? updatedTask : task))) // Update state with the edited task
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  // Function to delete a task
  const handleDeleteTask = async id => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(tasks.filter(task => task._id !== id)) // Remove deleted task from state
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Render
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

export default App
