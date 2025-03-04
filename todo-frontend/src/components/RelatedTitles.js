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
    try {
      // Sending the new task to the backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask) // Ensure that newTask is correctly passed as JSON
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      // Re-fetch the related tasks after adding a new task
      const fetchRelatedTasks = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}/related`
          )
          const data = await response.json()
          setRelatedTasks(data) // Only update the related tasks state
        } catch (error) {
          console.error('Error fetching related tasks:', error)
        }
      }

      fetchRelatedTasks() // Re-fetch only the related tasks to avoid any mix-up
    } catch (error) {
      console.error('Error adding task:', error)
    }
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
