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
        )
        const data = await response.json()

        if (response.ok && Array.isArray(data)) {
          setRelatedTasks(data) // ✅ Correctly set related tasks
        } else {
          console.warn('No related tasks found or unexpected format', data)
          setRelatedTasks([]) // ✅ Handle empty case properly
        }
      } catch (error) {
        console.error('Error fetching related tasks:', error)
        setRelatedTasks([]) // ✅ Ensure UI doesn't break
      }
    }
    fetchRelatedTasks()
  }, [id])

  const handleAdd = async newTask => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask) // Ensure newTask is passed correctly
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      // Re-fetch related tasks after adding a new task
      const fetchRelatedTasks = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}/related`
          )
          const data = await response.json()

          setRelatedTasks(Array.isArray(data) ? data : []) // Ensure it's always an array
        } catch (error) {
          console.error('Error fetching related tasks:', error)
          setRelatedTasks([])
        }
      }

      fetchRelatedTasks() // Re-fetch related tasks
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  return (
    <div>
      <h1>Related Titles for Task ID: {id}</h1>
      <TaskForm onAdd={handleAdd} />
      {relatedTasks.length > 0 ? (
        <TaskList tasks={relatedTasks} />
      ) : (
        <p>No related tasks found.</p>
      )}
    </div>
  )
}

export default RelatedTitles
