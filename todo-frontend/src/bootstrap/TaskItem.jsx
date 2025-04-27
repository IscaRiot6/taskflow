import '../styles/TaskItem.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const TaskItem = ({ task, onDelete, onEdit, onFavorite, isFavoritesPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(task.isFavorite || false)
  const [loading, setLoading] = useState(false)

  const images = [task.image, task.image2].filter(img => img)

  useEffect(() => {
    setIsFavorite(task.isFavorite || false)
  }, [task.isFavorite])

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const handleFavoriteClick = async () => {
    if (!onFavorite || loading) return

    const wasFavorite = isFavorite
    const nextState = !wasFavorite

    setLoading(true)
    await onFavorite(task, nextState)
    setIsFavorite(nextState)

    setLoading(false)
  }

  return (
    <li className='task-item'>
      <div className='task-info'>
        <Link to={`/task/${task._id}`} className='task-link'>
          <h3>
            <span className={`favorite-star ${isFavorite ? 'visible' : ''}`}>
              ⭐
            </span>
            {task.title}
          </h3>
        </Link>
        <p>Genres: {task.genres?.join(', ')}</p>
        <p>Themes: {task.themes?.join(', ')}</p>
        <p>Your Score: {task.yourScore}</p>
      </div>

      {images.length > 0 && (
        <div className='image-carousel'>
          <img
            src={images[currentImageIndex]}
            alt='Task'
            className='carousel-image'
          />
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
        {!isFavoritesPage && (
          <button className='task-btn edit' onClick={() => onEdit(task)}>
            Edit
          </button>
        )}

        {!isFavoritesPage && (
          <button
            className='task-btn delete'
            onClick={() => onDelete(task)} // ← just ask the parent to show the modal
          >
            Delete
          </button>
        )}

        <button
          className='task-btn favorite'
          onClick={handleFavoriteClick}
          disabled={loading}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          {loading ? (
            // Spinner or emoji
            <span className='forbidden-emoji'>⚡</span>
          ) : isFavorite ? (
            'Remove from Favorites'
          ) : (
            'Add to Favorites'
          )}
        </button>
      </div>
    </li>
  )
}

export default TaskItem
