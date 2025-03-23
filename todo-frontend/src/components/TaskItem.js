import '../styles/TaskItem.css'
import { Link } from 'react-router-dom'

const TaskItem = ({ task, onDelete, onEdit }) => {
  const genres = task.genres || []
  const themes = task.themes || []

  return (
    <li className='task-item'>
      <Link to={`/task/${task._id}`} className='task-link'>
        <h3>{task.title}</h3>
      </Link>
      {/* Description is removed */}
      <p>Genres: {genres.join(', ')}</p>
      <p>Themes: {themes.join(', ')}</p>
      <p>Your Score: {task.yourScore}</p>

      {/* Image validation fix */}
      {task.image ? (
        <img src={task.image} alt={task.title} />
      ) : (
        <p className='no-image'>No image available</p> // Optional fallback
      )}

      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  )
}

export default TaskItem
