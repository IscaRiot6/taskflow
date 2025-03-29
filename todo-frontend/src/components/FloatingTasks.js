import '../styles/FloatingTasks.css'

const FloatingTasks = () => {
  const tasks = [
    'Buy groceries 🛒',
    'Workout 💪',
    'No time for PS5 🎮🕹️👾',
    'Meeting at 3PM 🕒',
    'Watch more anime 💢🉐🎌',
    'Code review 👨‍💻'
  ]

  return (
    <div className='floating-tasks'>
      {tasks.map((task, index) => (
        <div key={index} className={`task task-${index}`}>
          {task}
        </div>
      ))}
    </div>
  )
}

export default FloatingTasks
