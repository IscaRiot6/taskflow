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
  // const paginatedTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)
  const paginatedTasks = Array.isArray(filteredTasks)
    ? filteredTasks.slice(indexOfFirstTask, indexOfLastTask)
    : [] // Fallback to empty array if filteredTasks is not an array

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
  }

  const handleAddTask = async taskData => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Add the auth token if needed
          },
          body: JSON.stringify(taskData)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const addedTask = await response.json()

      // After successfully adding to the backend, update frontend state
      setTasks(prev => [...prev, addedTask])

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
      const token = localStorage.getItem('authToken') // Get the auth token

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}` // Add token here
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(prev => prev.filter(task => task._id !== id))
      showNotification('Task deleted successfully!', 'success') // Show notification
    } catch (error) {
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
