import React, { useState, useEffect } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Modal from './Modal'
import SortTasks from './SortTasks'
import Pagination from './Pagination'
// import '../styles/Home.css'
import SearchTask from './SearchTask'

const Home = ({ tasks, setTasks }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks) // search input
  const [isFormVisible, setIsFormVisible] = useState(false) // HIDE
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 18 // Set the number of tasks per page

  // Calculate indexes for slicing
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const paginatedTasks = tasks.slice(indexOfFirstTask, indexOfLastTask) // Only show relevant tasks

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_BACKEND_URL}/api/tasks`
  //       )
  //       const data = await response.json()
  //       if (tasks.length === 0) {
  //         setTasks(data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching tasks:', error)
  //     }
  //   }
  //   fetchTasks()
  // }, [setTasks])

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

      // Only add to the global list if it's not a related task
      if (!taskData.isRelated) {
        setTasks(prevTasks => [...prevTasks, addedTask])
      }
      setIsFormVisible(false) // Hide the form after adding a task
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
  console.log('Tasks received in Home:', tasks)

  return (
    <div className='home-container'>
      <div className='left-panel'>
        <h1>My Task List</h1>

        {/* Button to show/hide TaskForm */}
        <button
          className='toggle-form-btn'
          onClick={() => setIsFormVisible(prev => !prev)}
        >
          {isFormVisible ? 'Hide Form' : 'New Task'}
        </button>

        {/* Show TaskForm only if the state is true */}
        {isFormVisible && <TaskForm onAdd={handleAddTask} />}

        <SortTasks tasks={tasks} setTasks={setTasks} />
      </div>

      <div className='right-panel'>
        <TaskList
          tasks={paginatedTasks}
          onDelete={handleDeleteTask}
          onEdit={setEditingTask}
        />
        <Pagination
          tasks={tasks}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          tasksPerPage={tasksPerPage}
        />
      </div>

      {isModalOpen && (
        <Modal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleEditTask}
        />
      )}
    </div>
  )
}

export default Home
