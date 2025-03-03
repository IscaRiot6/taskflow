import TaskItem from './TaskItem'
import '../styles/TaskList.css'

const TaskList = ({ tasks, onDelete, onEdit }) => {
  return (
    <div className='task-list'>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

export default TaskList
