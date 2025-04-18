import '../styles/TaskItem.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const TaskItem = ({ task, onDelete, onEdit, onFavorite, isFavoritesPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(task.isFavorite || false)
  const [loading, setLoading] = useState(false)
  const [favoriteAction, setFavoriteAction] = useState(null) // 'added' or 'removed'
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    onDelete(task._id)
    setShowDeleteModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

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
    setFavoriteAction(nextState ? 'added' : 'removed')

    // Show notification temporarily
    setTimeout(() => setFavoriteAction(null), 2000)
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
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        )}

        {showDeleteModal && (
          <ConfirmDeleteModal
            message={`Are you sure you want to delete "${task.title}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
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

        {favoriteAction && (
          <div className={`favorite-status ${favoriteAction}`}>
            {favoriteAction === 'added'
              ? 'Added to Favorites'
              : 'Removed from Favorites'}
          </div>
        )}
      </div>
    </li>
  )
}

export default TaskItem
