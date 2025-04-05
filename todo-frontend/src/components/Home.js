import React, { useState, useEffect } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Modal from './Modal'
import SortTasks from './SortTasks'
import Pagination from './Pagination'
import SearchTask from './SearchTask'
import Notification from './Notification' // Import Notification component

const Home = ({ tasks, setTasks }) => {
  const [theme, setTheme] = useState('default')
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [notification, setNotification] = useState(null) // Notification state
  const tasksPerPage = 18

  useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const paginatedTasks = Array.isArray(filteredTasks)
    ? filteredTasks.slice(indexOfFirstTask, indexOfLastTask)
    : []

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
  }

  const handleAddTask = async taskData => {
    console.log('Adding task:', taskData)

    // Remove empty parentTaskId so backend doesn't misclassify
    if (
      taskData.parentTaskId === undefined ||
      taskData.parentTaskId === null ||
      taskData.parentTaskId === ''
    ) {
      delete taskData.parentTaskId
    }

    console.log(
      '🟡 Final task data to be sent:',
      JSON.stringify(taskData, null, 2)
    )

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(taskData)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const addedTask = await response.json()

      setTasks(prev => {
        const updatedTasks = [...prev, addedTask]
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        return updatedTasks
      })

      setIsFormVisible(false)
      showNotification('Task added successfully!', 'success')
    } catch (error) {
      console.error('Error adding task:', error)
      showNotification('Failed to add task.', 'error')
    }
  }

  const handleEditTask = async updatedTaskData => {
    try {
      const token = localStorage.getItem('authToken') // Get auth token from localStorage
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${updatedTaskData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(updatedTaskData)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      // console.log('Task updated successfully:', updatedTaskData)
      setTasks(prev =>
        prev.map(task =>
          task._id === updatedTask._id ? updatedTaskData : task
        )
      )
      closeModal()
      showNotification('Task updated successfully!', 'success') // Show notification after update
    } catch (error) {
      console.error('Error editing task:', error)
      showNotification('Failed to update task.', 'error')
    }
  }

  const handleDeleteTask = async id => {
    try {
      // Step 1: Get the auth token
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No auth token found')
      }

      // Step 2: Log the token and task ID for debugging
      console.log('🔑 Auth Token:', token)
      console.log('🛑 Task ID being sent:', id)

      // Step 3: Send the DELETE request to the backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}` // Send token here
          }
        }
      )

      // Step 4: If response is not ok, log error and show notification
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error deleting task:', errorData)
        throw new Error(errorData.error || 'Failed to delete task')
      }

      // Step 5: Update the local state to remove the deleted task
      console.log('📋 Tasks before deletion:', tasks)

      setTasks(prev => prev.filter(task => task._id !== id))
      console.log('🧼 Filtering out task with ID:', id)

      // Step 6: Show success notification
      showNotification('Task deleted successfully!', 'success')
    } catch (error) {
      // Step 7: Catch and log the error, and show notification
      console.error('Error deleting task:', error)
      showNotification('Failed to delete task.', 'error')
    }
  }

  // Add to favorites function
  const handleAddToFavorites = async task => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/favorite`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskId: task._id })
        }
      )

      if (response.ok) {
        // Toggle the task's favorite status locally
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t._id === task._id ? { ...t, favorite: !t.favorite } : t
          )
        )
        console.log('Task favorite status updated')
        // Show success notification
        showNotification('Task has been added to your favorites.', 'success')
      } else {
        console.error('Failed to update favorite status')
        // Show error notification
        showNotification('Failed to add task to favorites.', 'error')
      }
    } catch (error) {
      console.error('Error updating favorite status:', error)
      // Show error notification
      showNotification('Error adding task to favorites.', 'error')
    }
  }

  const openEditModal = task => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className={`home-container theme-${theme}`}>
      {/* <ThemeToggle currentTheme={theme} setTheme={setTheme} /> */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className='left-panel'>
        <h1 className='welcome-heading'>Welcome to the Task Manager</h1>
        <button
          className='toggle-form-btn'
          onClick={() => setIsFormVisible(prev => !prev)}
        >
          {isFormVisible ? 'Hide Form' : 'New Task'}
        </button>
        {isFormVisible && <TaskForm onAdd={handleAddTask} />}
        <SortTasks tasks={tasks} setTasks={setTasks} />
      </div>

      <div className='right-panel'>
        <div className='search-container'>
          <SearchTask tasks={tasks} setFilteredTasks={setFilteredTasks} />
        </div>

        <TaskList
          tasks={paginatedTasks}
          onDelete={handleDeleteTask}
          onEdit={openEditModal}
          onFavorite={handleAddToFavorites} // Pass onFavorite function here
        />

        <Pagination
          tasks={filteredTasks}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          tasksPerPage={tasksPerPage}
        />
      </div>

      {isModalOpen && (
        <Modal
          task={editingTask}
          onClose={closeModal}
          onSave={handleEditTask}
        />
      )}
    </div>
  )
}

export default Home
