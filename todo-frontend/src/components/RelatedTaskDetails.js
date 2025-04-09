import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import '../styles/RelatedTaskDetails.css'

const RelatedTaskDetails = ({ tasks = [] }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [editSuccess, setEditSuccess] = useState(false)
  const navigate = useNavigate()
  const { relatedId } = useParams() // ✅ Get the relatedId from URL
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchTask = async () => {
      // Step 1: Get the token
      const token = localStorage.getItem('authToken')
      console.log('Token in RelatedTaskDetails:', token) // Confirm token retrieval

      // Step 2: Check if token exists
      if (!token) {
        console.warn('No token found, skipping fetch')
        setLoading(false) // Stop loading if no token is found
        return
      }

      // Step 3: Fetch the task details with token
      try {
        const res = await fetch(
          `http://localhost:5000/api/related-tasks/related/${relatedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Fetch failed:', errorText)
          throw new Error('Failed to fetch task details')
        }

        const data = await res.json()
        setTask(data) // Set the task state with fetched data
        setLoading(false)
      } catch (err) {
        console.error('Error fetching task:', err)
        setLoading(false)
      }
    }

    fetchTask() // Call the async fetch function
  }, [relatedId]) // Dependency array ensures that fetchTask is called when relatedId changes

  if (loading) return <div className='loader'>Loading...</div>
  if (!task) return <div className='error'>Task not found.</div>

  const images = [task.image, task.image2].filter(Boolean)

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleEditModalOpen = () => {
    setEditingTask(task) // Assuming 'task' holds the full individual task object
  }

  const handleEditModalClose = () => {
    setEditingTask(null)
  }

  const handleUpdateTask = async updatedTaskData => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No auth token found!')
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/related-tasks/${task.parentTaskId}/${task._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedTaskData)
        }
      )

      const data = await response.json()
      setTask(data.relatedTask) // Assuming you use setTask to update the view
      setEditingTask(null) // Close modal
      setEditSuccess(true)
      setTimeout(() => setEditSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  return (
    <div className='child-task-details-container'>
      <h1>{task.title}</h1>
      {images.length > 1 ? (
        <div className='child-carousel'>
          <button className='carousel-btn left' onClick={handlePrevImage}>
            &#10094;
          </button>
          <img
            src={images[currentImageIndex]}
            alt={task.title}
            className='child-task-image'
          />
          <button className='carousel-btn right' onClick={handleNextImage}>
            &#10095;
          </button>
        </div>
      ) : (
        <img src={task.image} alt={task.title} className='child-task-image' />
      )}
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
      <div className='child-task-buttons'>
        <button className='task-btn edit' onClick={handleEditModalOpen}>
          Edit
        </button>

        <button
          className='task-btn back-btn'
          onClick={() => navigate(`/related-titles/${task.parentTaskId}`)}
        >
          Back
        </button>
      </div>
      {editingTask && (
        <Modal
          task={editingTask}
          onClose={handleEditModalClose}
          onSave={handleUpdateTask}
        />
      )}
      {editSuccess && (
        <div className='edit-success'>Task updated successfully!</div>
      )}
    </div>
  )
}

export default RelatedTaskDetails
