import { useState, useEffect } from 'react'
import '../styles/Modal.css'

const Modal = ({ task, onClose, onSave }) => {
  const [newTitle, setNewTitle] = useState(task?.title || '')
  const [newDescription, setNewDescription] = useState(task?.description || '')
  const [newImage, setNewImage] = useState(task?.image || '')
  const [newImage2, setNewImage2] = useState(task?.image2 || '') // Added this
  const [newGenres, setNewGenres] = useState(task?.genres.join(', ') || '')
  const [newThemes, setNewThemes] = useState(task?.themes.join(', ') || '')
  const [newScore, setNewScore] = useState(task?.yourScore || '')

  useEffect(() => {
    setNewTitle(task?.title || '')
    setNewDescription(task?.description || '')
    setNewImage(task?.image || '')
    setNewImage2(task?.image2 || '') // Added this
    setNewGenres(task?.genres.join(', ') || '')
    setNewThemes(task?.themes.join(', ') || '')
    setNewScore(task?.yourScore || '')
  }, [task])

  const handleSave = () => {
    if (!newTitle.trim()) return // Prevent empty title

    const updatedTaskData = {
      _id: task._id,
      title: newTitle,
      description: newDescription,
      image: newImage,
      image2: newImage2,
      genres: newGenres.split(',').map(g => g.trim()),
      themes: newThemes.split(',').map(t => t.trim()),
      yourScore: newScore ? Number(newScore) : 0
    }

    console.log('Saving task:', updatedTaskData)

    onSave(updatedTaskData) // Calls handleEditTaskFromModal -> handleEditTask in App.js
    onClose()
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Edit Task</h2>
        <input
          type='text'
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Task Title'
        />
        <textarea
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          placeholder='Description'
        />
        <input
          type='text'
          value={newImage}
          onChange={e => setNewImage(e.target.value)}
          placeholder='Image URL'
        />
        <input
          type='text'
          value={newImage2} // Added this
          onChange={e => setNewImage2(e.target.value)} // Added this
          placeholder='Second Image URL' // Added this
        />
        <input
          type='text'
          value={newGenres}
          onChange={e => setNewGenres(e.target.value)}
          placeholder='Genres (comma separated)'
        />
        <input
          type='text'
          value={newThemes}
          onChange={e => setNewThemes(e.target.value)}
          placeholder='Themes (comma separated)'
        />
        <input
          type='number'
          value={newScore}
          onChange={e => setNewScore(e.target.value)}
          placeholder='Your Score'
        />
        <div className='modal-actions'>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Modal
