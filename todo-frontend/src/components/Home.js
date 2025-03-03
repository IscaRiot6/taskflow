import React, { useState, useEffect } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Modal from './Modal'

const Home = ({ tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tasks`
        )
        const data = await response.json()
        if (tasks.length === 0) {
          setTasks(data)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
  }, [setTasks])

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
      setTasks(prevTasks => [...prevTasks, addedTask])
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleEditTask = async updatedTaskData => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${updatedTaskData._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTaskData) // Send the full task data
        }
      )

      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === updatedTaskData._id ? updatedTask : task
        )
      )

      closeModal() // Ensure modal closes after updating
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  const handleDeleteTask = async id => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
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
      <div className='left-panel'>
        <h1>My Task List</h1>
        <TaskForm onAdd={handleAddTask} />
      </div>

      <div className='right-panel'>
        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEdit={openEditModal}
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
