import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

const RelatedTitles = ({ onAdd }) => {
  const { id } = useParams() // Get the task ID from the URL
  const [relatedTasks, setRelatedTasks] = useState([])

  // Fetch related tasks from the backend
  useEffect(() => {
    const fetchRelatedTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}/related`
        ) // Replace with your actual backend endpoint
        const data = await response.json()
        setRelatedTasks(data)
      } catch (error) {
        console.error('Error fetching related tasks:', error)
      }
    }
    fetchRelatedTasks()
  }, [id]) // Fetch whenever the ID changes

  const handleAdd = async newTask => {
    if (onAdd) {
      onAdd(newTask) // Pass the new task to the onAdd function (possibly saving it to the backend)
    } else {
      console.error('onAdd function is not available')
    }

    // After adding a new task, re-fetch the related tasks (to ensure the latest ones are displayed)
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}/related`
    )
    const data = await response.json()
    setRelatedTasks(data)
  }

  return (
    <div>
      <h1>Related Titles for Task ID: {id}</h1>
      <TaskForm onAdd={handleAdd} />
      <TaskList tasks={relatedTasks} />
    </div>
  )
}

export default RelatedTitles
