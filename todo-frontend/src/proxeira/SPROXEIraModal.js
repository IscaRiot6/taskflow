import { useState, useEffect } from 'react'
import '../styles/Modal.css'

const Modal = ({ task, onClose, onSave }) => {
  const [newTitle, setNewTitle] = useState(task?.title || '')
  const [newDescription, setNewDescription] = useState(task?.description || '')
  const [newImage, setNewImage] = useState(task?.image || '')
  const [newGenres, setNewGenres] = useState(task?.genres.join(', ') || '')
  const [newThemes, setNewThemes] = useState(task?.themes.join(', ') || '')
  const [newScore, setNewScore] = useState(task?.yourScore || '')

  useEffect(() => {
    setNewTitle(task?.title || '')
    setNewDescription(task?.description || '')
    setNewImage(task?.image || '')
    setNewGenres(task?.genres.join(', ') || '')
    setNewThemes(task?.themes.join(', ') || '')
    setNewScore(task?.yourScore || '')
  }, [task])

  const handleSave = () => {
    if (!newTitle.trim()) return // Prevent saving empty titles

    // Construct an object with all the updated task data
    const updatedTaskData = {
      _id: task._id, // The task ID (for the backend)
      title: newTitle, // Updated title
      description: newDescription, // Updated description
      image: newImage, // Updated image URL
      genres: newGenres.split(',').map(genre => genre.trim()), // Ensure genres are an array
      themes: newThemes.split(',').map(theme => theme.trim()), // Ensure themes are an array
      yourScore: newScore ? Number(newScore) : 0 // Ensure score is a number
    }

    // Pass the updated task data to the onSave function
    onSave(updatedTaskData)
    onClose() // Close the modal after saving
  }

  // Detect "Enter" key press and trigger handleSave
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
          onKeyDown={handleKeyDown} // Listen for Enter key
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
