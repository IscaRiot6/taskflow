import '../styles/TaskDetails.css'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const TaskDetails = ({ tasks, onEdit }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const task = tasks.find(task => task._id === id)

  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(task?.title || '')
  const [newDescription, setNewDescription] = useState(task?.description || '')
  const [newImage, setNewImage] = useState(task?.image || '')
  const [newGenres, setNewGenres] = useState(task?.genres.join(', ') || '')
  const [newThemes, setNewThemes] = useState(task?.themes.join(', ') || '')
  const [newScore, setNewScore] = useState(task?.yourScore || '')

  if (!task) {
    return <h2>Task Not Found</h2>
  }

  const handleSave = () => {
    onEdit(
      id,
      newTitle,
      newDescription,
      newImage,
      newGenres.split(','),
      newThemes.split(','),
      newScore
    )
    setIsEditing(false)
  }

  return (
    <div className='task-details-container'>
      {isEditing ? (
        <>
          <input
            type='text'
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <textarea
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
          <input
            type='text'
            value={newImage}
            onChange={e => setNewImage(e.target.value)}
          />
          <input
            type='text'
            value={newGenres}
            onChange={e => setNewGenres(e.target.value)}
          />
          <input
            type='text'
            value={newThemes}
            onChange={e => setNewThemes(e.target.value)}
          />
          <input
            type='number'
            value={newScore}
            onChange={e => setNewScore(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
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
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => navigate('/')}>Back</button>
        </>
      )}
    </div>
  )
}

export default TaskDetails
