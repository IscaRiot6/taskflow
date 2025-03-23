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
          `http://localhost:5000/api/tasks/${id}/related`
        )
        if (!response.ok) throw new Error('Failed to fetch related tasks')
        const data = await response.json()
        setRelatedTasks(data)
      } catch (error) {
        console.error('Error fetching related tasks:', error)
      }
    }
    fetchRelatedTasks()
  }, [id])

  const handleAdd = async newTask => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}/related`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        }
      )

      if (!response.ok) throw new Error('Failed to create and add related task')

      const { relatedTask } = await response.json()

      // Update UI with the new related task
      setRelatedTasks(prev => [...prev, relatedTask])
    } catch (error) {
      console.error('Error adding related task:', error)
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
