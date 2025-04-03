import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
import RelatedTaskForm from './RelatedTaskForm'
import RelatedTaskItem from './RelatedTaskItem'
import Notification from './Notification'

const RelatedTasks = () => {
  const [relatedTasks, setRelatedTasks] = useState([])
  const [showForm, setShowForm] = useState(false) // Toggle form visibility
  const { taskId } = useParams() // Get the parent taskId from the URL
  const [notification, setNotification] = useState(null) // Notification state
  const navigate = useNavigate()

  // Fetch related tasks when the component loads
  useEffect(() => {
    const fetchRelatedTasks = async () => {
      if (!taskId) {
        console.warn('taskId is undefined, skipping fetch')
        return
      }

      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          console.error('No auth token found in localStorage!')
          return
        }

        console.log('Fetching related tasks for:', taskId)

        const response = await fetch(
          `http://localhost:5000/api/related-tasks/${taskId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` // Authorization token
            }
          }
        )
        const data = await response.json()
        console.log('Fetched related tasks:', data)

        if (Array.isArray(data)) {
          setRelatedTasks(data) // Set related tasks if it's an array
        } else {
          console.error('Fetched data is not an array:', data) // Log an error if data is not an array
        }
      } catch (error) {
        console.error('Error fetching related tasks:', error)
      }
    }
    fetchRelatedTasks()
  }, [taskId])

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
  }

  // Handle new related task creation
  const handleAddTask = async newTaskData => {
    console.log('Attempting to add task:', newTaskData) // Check the task data

    if (!newTaskData.title.trim()) {
      console.error('Invalid Task Data')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No auth token found in localStorage!')
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/related-tasks/${taskId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Authorization token
          },
          body: JSON.stringify(newTaskData)
        }
      )
      const data = await response.json()
      console.log('Server Response:', data)

      if (data.relatedTask) {
        setRelatedTasks(prevTasks => [...prevTasks, data.relatedTask])

        setShowForm(false)
        showNotification('Task added successfully!', 'success')
        return data.relatedTask // Return the newly added task
      }
    } catch (error) {
      console.error('Error adding related task:', error)
      showNotification('Failed to add task.', 'error')

      return null
    }
  }

  // Handle task update (could be a modal or form to edit the title)
  const handleUpdateTask = async (relatedTaskId, newTitle) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No auth token found in localStorage!')
        return
      }

      const updatedTask = { title: newTitle }
      const response = await fetch(
        `http://localhost:5000/api/related-tasks/${taskId}/${relatedTaskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Moved inside headers
          },
          body: JSON.stringify(updatedTask)
        }
      )

      const data = await response.json()
      setRelatedTasks(
        relatedTasks.map(task =>
          task._id === relatedTaskId ? data.relatedTask : task
        )
      )
    } catch (error) {
      console.error('Error updating related task:', error)
    }
  }

  // Handle task deletion
  const handleDeleteTask = async relatedTaskId => {
    try {
      const token = localStorage.getItem('authToken')
      console.log(
        `Deleting related task ${relatedTaskId} for parent task ${taskId}`
      )
      console.log('Stored token:', token)

      const response = await fetch(
        `http://localhost:5000/api/related-tasks/${taskId}/${relatedTaskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}` // Add token here
          }
        }
      )
      if (response.ok) {
        setRelatedTasks(relatedTasks.filter(task => task._id !== relatedTaskId))
      } else {
        console.error('Failed to delete related task')
      }
    } catch (error) {
      console.error('Error deleting related task:', error)
    }
  }

  // Log relatedTasks state on each render
  console.log('Related tasks state:', relatedTasks)

  return (
    <div className='related-tasks-container'>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <h1>Related Tasks for Task {taskId}</h1>

      {/* Toggle Button */}
      <button
        className='toggle-form-btn'
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Add Related Task'}
      </button>

      {/* Show Form if Open */}
      {showForm && (
        <RelatedTaskForm onAdd={handleAddTask} parentTaskId={taskId} />
      )}

      <ul className='task-list'>
        {relatedTasks.length > 0 ? (
          relatedTasks.map(task => (
            <RelatedTaskItem
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onEdit={task =>
                handleUpdateTask(task._id, prompt('New title:', task.title))
              }
              // onFavorite={handleFavoriteTask} // Assuming this function exists in your component
            />
          ))
        ) : (
          <p>No related tasks available</p>
        )}
      </ul>
    </div>
  )
}

export default RelatedTasks
