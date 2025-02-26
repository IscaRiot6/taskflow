// src/components/TaskItem.js
const TaskItem = ({ task, onDelete, onEdit }) => {
  const handleEdit = () => {
    const newTitle = prompt('Enter new title:', task.title)
    if (newTitle) {
      onEdit(task._id, newTitle)
    }
  }

  return (
    <li>
      {task.title}
      <button onClick={handleEdit}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  )
}

export default TaskItem
