import React, { useState, useEffect } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Modal from './Modal'
import SortTasks from './SortTasks'
import Pagination from './Pagination'
import SearchTask from './SearchTask'
import Notification from './Notification' // Import Notification component
import ConfirmDeleteModal from './ConfirmDeleteModal'

const Home = ({ tasks, setTasks }) => {
  const [theme, setTheme] = useState('default')
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [notification, setNotification] = useState(null) // Notification state
  const tasksPerPage = 18
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // this tells Home “please show me the delete‑confirmation for that one task”
  const requestDeleteTask = task => {
    setDeleteCandidate(task)
  }

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

  const handleReallyDelete = async id => {
    setDeleting(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No auth token found')

      console.log('🔑 Auth Token:', token)
      console.log('🛑 Task ID being sent:', id)

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error deleting task:', errorData)
        throw new Error(errorData.error || 'Failed to delete task')
      }

      // remove from state
      setTasks(prev => prev.filter(task => task._id !== id))
      console.log('🧼 Task removed locally:', id)

      showNotification('Task deleted successfully!', 'success')
    } catch (error) {
      console.error('Error deleting task:', error)
      showNotification('Failed to delete task.', 'error')
    } finally {
      setDeleting(false)
      setDeleteCandidate(null)
    }
  }

  const handleAddToFavorites = async (task, nextState) => {
    try {
      const method = nextState ? 'PUT' : 'DELETE'

      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/favorite`,
        {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          body: nextState ? JSON.stringify({ taskId: task._id }) : null
        }
      )

      if (response.ok) {
        // Update tasks list
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t._id === task._id ? { ...t, isFavorite: nextState } : t
          )
        )

        showNotification(
          nextState
            ? 'Task has been added to your favorites.'
            : 'Task has been removed from your favorites.',
          'success'
        )
      } else {
        showNotification('Failed to update favorite status.', 'error')
      }
    } catch (error) {
      console.error('Error updating favorite status:', error)
      showNotification('Error updating favorite status.', 'error')
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
          onDeleteRequest={requestDeleteTask}
          onEdit={openEditModal}
          onFavorite={handleAddToFavorites} // Pass onFavorite function here
        />

        {/* only one global modal in Home */}
        {deleteCandidate && (
          <ConfirmDeleteModal
            message={`Are you sure you want to delete “${deleteCandidate.title}”?`}
            onConfirm={() => handleReallyDelete(deleteCandidate._id)}
            onCancel={() => setDeleteCandidate(null)}
            isDeleting={deleting}
          />
        )}

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
