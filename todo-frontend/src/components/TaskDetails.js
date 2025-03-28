import '../styles/TaskDetails.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { Link } from 'react-router-dom'

const TaskDetails = ({ tasks, onEdit }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [editSuccess, setEditSuccess] = useState(false) // Success message state

  useEffect(() => {
    const foundTask = tasks.find(task => task._id === id)
    setTask(foundTask || null)
  }, [tasks, id])

  if (!task) {
    return <h2>Task Not Found</h2>
  }

  const images = [task.image, task.image2].filter(Boolean)

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleSave = updatedTask => {
    onEdit(
      updatedTask._id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.image,
      updatedTask.image2,
      updatedTask.genres,
      updatedTask.themes,
      updatedTask.yourScore
    )

    setIsModalOpen(false)
    setEditSuccess(true) // Show success message

    setTimeout(() => setEditSuccess(false), 3000) // Hide after 3 seconds
  }

  return (
    <div className='task-details-container'>
      <h1>{task.title}</h1>

      {images.length > 1 ? (
        <div className='carousel'>
          <button className='carousel-btn left' onClick={handlePrevImage}>
            &#10094;
          </button>
          <img
            src={images[currentImageIndex]}
            alt={task.title}
            className='task-image'
          />
          <button className='carousel-btn right' onClick={handleNextImage}>
            &#10095;
          </button>
        </div>
      ) : (
        <img src={task.image} alt={task.title} className='task-image' />
      )}

      <p>
        <strong>Description:</strong> {task.description}
      </p>
      <p>
        <strong>Genres:</strong> {task.genres.join(', ')}
      </p>
      <p>
        <strong>Themes:</strong> {task.themes.join(', ')}
      </p>
      <p>
        <strong>Score:</strong> {task.yourScore}
      </p>

      {/* Button Container for Proper Spacing */}
      <div className='task-buttons'>
        <button className='task-btn edit' onClick={() => setIsModalOpen(true)}>
          Edit
        </button>

        <button className='task-btn back-btn' onClick={() => navigate('/home')}>
          Back
        </button>

        <Link
          to={`/related-titles/${task._id}`}
          className='related-titles-link'
        >
          View Related Titles
        </Link>
      </div>

      {isModalOpen && (
        <Modal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {editSuccess && (
        <div className='edit-success'>Task updated successfully!</div>
      )}
    </div>
  )
}

export default TaskDetails
