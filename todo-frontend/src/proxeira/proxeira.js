import React, { useState, useEffect } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Modal from './Modal'
import SortTasks from './SortTasks'
import Pagination from './Pagination'
import SearchTask from './SearchTask'
import Notification from './Notification' // Import Notification component

const Home = ({ tasks, setTasks }) => {
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
  const paginatedTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        }
      )
      const addedTask = await response.json()

      if (!taskData.isRelated) {
        setTasks(prev => [...prev, addedTask])
      }
      setIsFormVisible(false)
      showNotification('Task added successfully!', 'success') // Trigger notification
    } catch (error) {
      console.error('Error adding task:', error)
      showNotification('Failed to add task.', 'error') // Error notification
    }
  }

  const handleEditTask = async updatedTaskData => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${updatedTaskData._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTaskData)
        }
      )
      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()
      setTasks(prev =>
        prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
      )
      closeModal()
      showNotification('Task updated successfully!', 'success') // Notification for edit
    } catch (error) {
      console.error('Error editing task:', error)
      showNotification('Failed to update task.', 'error')
    }
  }

  const handleDeleteTask = async id => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(prev => prev.filter(task => task._id !== id))
      showNotification('Task deleted successfully!', 'success') // Notification for delete
    } catch (error) {
      console.error('Error deleting task:', error)
      showNotification('Failed to delete task.', 'error')
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
    <div className='home-container'>
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
