// src/components/TaskList.js
import TaskItem from './TaskItem'

const TaskList = ({ tasks, onDelete, onEdit }) => {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}

export default TaskList
