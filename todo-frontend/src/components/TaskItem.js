import '../styles/TaskItem.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const TaskItem = ({ task, onDelete, onEdit, onFavorite, isFavoritesPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(task.favorite || false) // Track favorite status

  const images = [task.image, task.image2].filter(img => img) // Only valid images

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  // Handle the "Add to Favorites" or "Remove from Favorites" functionality
  const handleFavoriteClick = () => {
    if (isFavoritesPage) {
      // On the favorites page, remove the task from favorites
      setIsFavorite(false) // Update local state
      if (onFavorite) {
        onFavorite(task, false) // Call onFavorite to remove it from favorites
      } else {
        console.error('onFavorite is not a function')
      }
    } else {
      // On other pages, add the task to favorites
      setIsFavorite(true) // Update local state
      if (onFavorite) {
        onFavorite(task, true) // Call onFavorite to add it to favorites
      } else {
        console.error('onFavorite is not a function')
      }
    }
  }

  return (
    <li className='task-item'>
      <div className='task-info'>
        <Link to={`/task/${task._id}`} className='task-link'>
          <h3>{task.title}</h3>
        </Link>
        <p>Genres: {task.genres?.join(', ')}</p>
        <p>Themes: {task.themes?.join(', ')}</p>
        <p>Your Score: {task.yourScore}</p>
      </div>

      {/* Image Carousel */}
      {images.length > 0 && (
        <div className='image-carousel'>
          <img
            src={images[currentImageIndex]}
            alt='Task'
            className='carousel-image'
          />

          {/* Show buttons only if multiple images exist */}
          {images.length > 1 && (
            <>
              <button
                className='task-carousel-button taskItem-left'
                onClick={prevImage}
              >
                &#x25C0;
              </button>
              <button
                className='task-carousel-button taskItem-right'
                onClick={nextImage}
              >
                &#x25B6;
              </button>
            </>
          )}
        </div>
      )}

      <div className='task-buttons'>
        {/* Show Edit button only on home page */}
        {!isFavoritesPage && (
          <button className='task-btn edit' onClick={() => onEdit(task)}>
            Edit
          </button>
        )}

        {/* Hide Delete button on favorites page */}
        {!isFavoritesPage && (
          <button
            className='task-btn delete'
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        )}

        {/* Show Add to Favorites/Remove from Favorites button */}
        <button className='task-btn favorite' onClick={handleFavoriteClick}>
          {isFavoritesPage ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </li>
  )
}

export default TaskItem
