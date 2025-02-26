// src/components/TaskForm.js
import { useState } from 'react'

const TaskForm = ({ onAdd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleAddTask = async e => {
    e.preventDefault()
    if (!newTaskTitle) return
    const task = await onAdd(newTaskTitle)
    setNewTaskTitle('')
    return task
  }

  return (
    <form onSubmit={handleAddTask}>
      <input
        type='text'
        value={newTaskTitle}
        onChange={e => setNewTaskTitle(e.target.value)}
        placeholder='Enter new task'
      />
      <button type='submit'>Add Task</button>
    </form>
  )
}

export default TaskForm
