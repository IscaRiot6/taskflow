import { useState, useEffect } from 'react'
import Favorites from '../components/Favorites'

const FavoritesPage = () => {
  const [favoriteTasks, setFavoriteTasks] = useState([])
  const authToken = localStorage.getItem('authToken') // Retrieve token

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
        setFavoriteTasks(data)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching favorites:', error)
        }
      }
    }

    fetchFavorites()

    return () => controller.abort() // Cleanup function
  }, [authToken])

  // Add to favorites function
  const handleAddToFavorites = async task => {
    console.log('Task ID being sent:', task._id)

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

  return (
    <div>
      <h2>Favorite Tasks</h2>
      <Favorites
        favoriteTasks={favoriteTasks}
        onFavorite={handleAddToFavorites}
        // isFavoritesPage={true}
      />
    </div>
  )
}

export default FavoritesPage
