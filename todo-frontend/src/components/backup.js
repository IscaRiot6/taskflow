// APP.js

import { useEffect, useState } from 'react'

function App () {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks`
        )
        const data = await response.json()
        console.log('Fetched tasks:', data) // ✅ Check what’s being fetched
        setTasks(data)
      } catch (error) {
        console.error('Error fetching tasks:', error) // ❌ Catch errors
      }
    }

    fetchTasks()
  }, [])

  const handleAddTask = async e => {
    e.preventDefault() // Prevent page refresh
    if (!newTaskTitle) return // Ensure title is provided

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newTaskTitle })
        }
      )
      const addedTask = await response.json()
      setTasks([...tasks, addedTask]) // Update state with the new task
      setNewTaskTitle('') // Clear input field
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  return (
    <div>
      <h1>My Task List</h1>
      <form onSubmit={handleAddTask}>
        <input
          type='text'
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder='Enter new task'
        />
        <button type='submit'>Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
