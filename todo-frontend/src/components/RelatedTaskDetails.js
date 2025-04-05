import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const RelatedTaskDetails = ({ tasks = [] }) => {
  const { taskId } = useParams() // Get params from URL
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  console.log('RelatedTaskDetails component mounted!')

  useEffect(() => {
    console.log('Tasks received in RelatedTaskDetails:', tasks)
    console.log('TaskId from URL:', taskId)

    if (!tasks || tasks.length === 0) {
      console.error('Tasks array is empty or undefined in RelatedTaskDetails.')

      // Try to get tasks from localStorage as a fallback
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []

      if (savedTasks.length > 0) {
        console.log('Loaded tasks from localStorage:', savedTasks)
        setTask(
          savedTasks.find(task => String(task._id) === String(taskId)) || null
        )
      }

      setLoading(false)
      return
    }

    const foundTask = tasks.find(task => String(task._id) === String(taskId))
    console.log('Task found:', foundTask)

    setTask(foundTask)
    setLoading(false)
  }, [taskId, tasks])

  if (loading) return <p>Loading...</p>
  if (!task) return <p>Task not found.</p>

  return (
    <div className='related-task-details-container'>
      <h1>{task.title}</h1>
      <p>
        <strong>Description:</strong>{' '}
        {task.description || 'No description available.'}
      </p>
      <p>
        <strong>Genres:</strong> {task.genres?.join(', ') || 'N/A'}
      </p>
      <p>
        <strong>Themes:</strong> {task.themes?.join(', ') || 'N/A'}
      </p>
      <p>
        <strong>Score:</strong> {task.yourScore ?? 'N/A'}
      </p>
    </div>
  )
}

export default RelatedTaskDetails
