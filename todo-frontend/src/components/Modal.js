import React, { useState } from 'react'

const Modal = ({ task, onClose, onSave }) => {
  const [newTitle, setNewTitle] = useState(task.title)

  const handleSave = () => {
    onSave(task._id, newTitle) // Pass the task id and new title
    onClose() // Close the modal after saving
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Edit Task</h2>
        <input
          type='text'
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default Modal
