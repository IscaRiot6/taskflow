import '../styles/TaskItem.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const TaskItem = ({ task, onDelete, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [task.image, task.image2].filter(img => img) // Only valid images

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
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
              <button className='prev-button' onClick={prevImage}>
                &lt;
              </button>
              <button className='next-button' onClick={nextImage}>
                &gt;
              </button>
            </>
          )}
        </div>
      )}

      <div className='task-buttons'>
        <button className='task-btn edit' onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className='task-btn delete' onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
