import '../styles/TaskDetails.css'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { Link } from 'react-router-dom'

const TaskDetails = ({ tasks, onEdit }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const task = tasks.find(task => task._id === id)

  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!task) {
    return <h2>Task Not Found</h2>
  }

  const handleSave = updatedTask => {
    onEdit(
      updatedTask._id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.image,
      updatedTask.genres,
      updatedTask.themes,
      updatedTask.yourScore
    )
    setIsModalOpen(false)
  }

  return (
    <div className='task-details-container'>
      <h1>{task.title}</h1>
      <img src={task.image} alt={task.title} className='task-image' />
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
      <button onClick={() => setIsModalOpen(true)}>Edit</button>
      <button onClick={() => navigate('/')}>Back</button>

      {isModalOpen && (
        <Modal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      <Link to={`/related-titles/${task._id}`} className='related-titles-link'>
        View Related Titles
      </Link>
    </div>
  )
}

export default TaskDetails
