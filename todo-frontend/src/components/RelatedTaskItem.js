import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/RelatedTaskItem.css'

const RelatedTaskItem = ({ task, onDelete, onEdit, onFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(task.isFavorite || false)
  const [loading, setLoading] = useState(false)
  const images = [task.image, task.image2].filter(img => img) // Only valid images
  const [showFavoriteStatus, setShowFavoriteStatus] = useState(false)

  useEffect(() => {
    setIsFavorite(task.isFavorite || false)
  }, [task.isFavorite])

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  // Handle the "Add to Favorites" or "Remove from Favorites" functionality
  const handleFavoriteClick = async () => {
    if (onFavorite && !loading) {
      setLoading(true)
      const nextState = !isFavorite
      await onFavorite(task, nextState)
      setIsFavorite(nextState)

      // Show feedback label
      setShowFavoriteStatus(true)
      setTimeout(() => setShowFavoriteStatus(false), 2000)

      setLoading(false)
    }
  }

  return (
    <div className='related-tasks-container'>
      <li className='related-task-item'>
        <div className='related-task-info'>
          <Link
            to={`/related-task-details/${task._id}`}
            className='related-task-link'
          >
            <h3>
              <span className={`favorite-star ${isFavorite ? 'visible' : ''}`}>
                ⭐
              </span>
              {/* {isFavorite ? '⭐ ' : ''} */}
              {task.title}
            </h3>
          </Link>

          <p>Genres: {task.genres?.join(', ')}</p>
          <p>Themes: {task.themes?.join(', ')}</p>
          <p>Your Score: {task.yourScore}</p>
        </div>

        {/* Image Carousel */}
        {images.length > 0 && (
          <div className='related-image-carousel'>
            <img
              src={images[currentImageIndex]}
              alt='Related Task'
              className='carousel-image'
            />

            {/* Show buttons only if multiple images exist */}
            {images.length > 1 && (
              <>
                <button
                  className='related-carousel-button related-left'
                  onClick={prevImage}
                >
                  &#x25C0;
                </button>
                <button
                  className='related-carousel-button related-right'
                  onClick={nextImage}
                >
                  &#x25B6;
                </button>
              </>
            )}
          </div>
        )}

        <div className='related-task-buttons'>
          {/* Edit and Delete buttons for related tasks */}
          <button
            className='related-task-btn edit'
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            className='related-task-btn delete'
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>

          {/* Favorite button */}
          <button
            className='related-task-btn star-toggle'
            onClick={handleFavoriteClick}
            disabled={loading}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            {loading ? (
              <span className='spinner'></span>
            ) : (
              <span className={`star-icon ${isFavorite ? 'filled' : ''}`}>
                {isFavorite ? '⭐' : '☆'}
              </span>
            )}
          </button>
          {showFavoriteStatus && (
            <div
              className={`favorite-status ${isFavorite ? 'added' : 'removed'}`}
            >
              {isFavorite ? 'Added to Favorites' : 'Removed from Favorites'}
            </div>
          )}
        </div>
      </li>
    </div>
  )
}

export default RelatedTaskItem
