import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const RelatedTaskDetails = () => {
  const { taskId, relatedId } = useParams() // Get params from URL
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Fetching related task with:', taskId, relatedId) // 🔍 Debugging log

    // Retrieve the token from localStorage (adjust this if you store it elsewhere)
    const token = localStorage.getItem('authToken')

    fetch(`http://localhost:5000/api/related-tasks/${taskId}/${relatedId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Add the token here
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('Response status:', res.status) // 🔍 Debugging log
        return res.json()
      })
      .then(data => {
        console.log('Fetched task:', data) // 🔍 Debugging log
        setTask(data)
        setLoading(false) // Done loading
      })
      .catch(err => {
        console.error('Error fetching task', err)
        setLoading(false) // Done loading even on error
      })
  }, [taskId, relatedId])

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
