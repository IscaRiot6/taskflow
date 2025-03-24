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

      {/* Image display with validation */}
      {task.image ? (
        <img src={task.image} alt='Task image' />
      ) : (
        <p className='no-image'>No image available</p>
      )}

      {task.image2 ? (
        <img src={task.image2} alt='Second task image' />
      ) : (
        <p className='no-image'>No second image available</p>
      )}

      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  )
}

export default TaskItem
