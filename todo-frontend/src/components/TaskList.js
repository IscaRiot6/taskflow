import TaskItem from './TaskItem'
import '../styles/TaskList.css'

const TaskList = ({ tasks, onDeleteRequest, onEdit, onFavorite }) => {
  return (
    <div className='task-list'>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDeleteRequest}
          onEdit={onEdit}
          onFavorite={onFavorite} // Pass onFavorite prop here
        />
      ))}
    </div>
  )
}

export default TaskList
