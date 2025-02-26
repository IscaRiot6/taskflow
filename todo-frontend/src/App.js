import { useEffect, useState } from 'react'

function App () {
  const [tasks, setTasks] = useState([])

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

  return (
    <div>
      <h1>My Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
