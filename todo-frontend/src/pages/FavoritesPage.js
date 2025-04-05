import { useState, useEffect } from 'react'
import Favorites from '../components/Favorites'
import Notification from '../components/Notification'
// import SortTasks from '../components/SortTasks'
import Pagination from '../components/Pagination'
import SearchTask from '../components/SearchTask'
import SortTasksWrapper from '../components/SortTasksWrapper'
import '../styles/FavoritesPage.css'

const FavoritesPage = () => {
  const [favoriteTasks, setFavoriteTasks] = useState([]) // Store all tasks
  const [filteredTasks, setFilteredTasks] = useState([]) // Store filtered tasks for sorting and search
  const [currentPage, setCurrentPage] = useState(1)
  const [tasksPerPage] = useState(18)
  const authToken = localStorage.getItem('authToken') // Retrieve token
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    if (!authToken) return // Prevent fetch if there's no token

    const controller = new AbortController() // To prevent memory leaks
    const signal = controller.signal

    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/favorites`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${authToken}` },
            signal // Attach abort signal
          }
        )
        if (!response.ok) throw new Error('Failed to fetch favorites')

        const data = await response.json()
        setFavoriteTasks(data) // Save all tasks
        setFilteredTasks(data) // Initialize filteredTasks
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching favorites:', error)
        }
      }
    }

    fetchFavorites()

    return () => controller.abort() // Cleanup function
  }, [authToken])

  // Pagination logic (use filteredTasks for pagination)
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const paginatedFavorites = filteredTasks.slice(
    indexOfFirstTask,
    indexOfLastTask
  )

  // Add to favorites function
  const handleAddToFavorites = async task => {
    // console.log('Task ID being sent:', task._id)

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/favorite`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskId: task._id })
        }
      )

      const result = await response.json()
      console.log('Server response:', result)

      if (response.ok) {
        console.log('Task added to favorites successfully')
        setFavoriteTasks(prev => [...prev, task])
      } else {
        console.error('Failed to add task to favorites', result)
      }
    } catch (error) {
      console.error('Error adding task to favorites:', error)
    }
  }

  // Remove from favorites function
  const handleRemoveFromFavorites = async task => {
    // to original edw
    try {
      console.log('Attempting to remove:', task._id)

      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/favorite`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      )

      if (response.ok) {
        setFavoriteTasks(prev => {
          const updatedFavorites = prev.filter(t => t._id !== task._id)
          setFilteredTasks(updatedFavorites)
          console.log('Updated favorites:', updatedFavorites)
          return updatedFavorites
        })

        // ✅ **Force a state change by spreading a new object**
        setNotification({ message: '', type: '' }) // Reset first
        setTimeout(() => {
          setNotification({
            message: 'Task removed from favorites',
            type: 'success'
          })
        }, 10)

        console.log('Notification set:', {
          message: 'Task removed from favorites',
          type: 'success'
        })
      } else {
        console.error('Failed to remove task from favorites')
        setNotification({
          message: 'Failed to remove task from favorites',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error removing task from favorites:', error)
      setNotification({
        message: 'Error removing task from favorites',
        type: 'error'
      })
    }
  }

  return (
    <>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '', id: 0 })}
        />
      )}
      <div className='favorites-container'>
        <div className='favorites-header'>
          <h1 className='favorites-title'>Your Favorite Tasks</h1>

          <p className='favorites-subtext'>
            Manage and organize your saved tasks easily.
          </p>
        </div>

        <SortTasksWrapper
          tasks={favoriteTasks}
          setFilteredTasks={setFilteredTasks}
        />

        <SearchTask tasks={favoriteTasks} setFilteredTasks={setFilteredTasks} />

        <Favorites
          favoriteTasks={paginatedFavorites}
          onFavorite={handleRemoveFromFavorites}
          isFavoritesPage={true}
        />

        <Pagination
          tasks={filteredTasks}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          tasksPerPage={tasksPerPage}
        />
      </div>
    </>
  )
}

export default FavoritesPage
