import React, { useState, useEffect } from 'react'

const TaskEditor = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(task)

  useEffect(() => {
    setEditedTask(task) // Set the task data when the task is passed in for editing
  }, [task])

  const handleChange = e => {
    const { name, value } = e.target
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(editedTask) // Call onSave with the edited task
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Task Name</label>
        <input
          type='text'
          name='name'
          value={editedTask.name || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name='description'
          value={editedTask.description || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type='submit'>Save</button>
        <button type='button' onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskEditor
