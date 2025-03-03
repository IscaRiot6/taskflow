import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/TaskDetails.css'

const TaskDetails = ({ tasks }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const task = tasks.find(task => task._id === id)

  if (!task) {
    return <h2>Task Not Found</h2>
  }

  return (
    <div className='task-details-container'>
      <h1>{task.title}</h1>
      <img src={task.image} alt={task.title} className='task-image' />
      <p>
        <strong>Genres:</strong> {task.genres.join(', ')}
      </p>
      <p>
        <strong>Themes:</strong> {task.themes.join(', ')}
      </p>
      <p>
        <strong>Score:</strong> {task.yourScore}
      </p>
      <p>
        <strong>Description:</strong> {task.description}
      </p>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default TaskDetails
