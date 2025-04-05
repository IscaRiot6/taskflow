import { useState } from 'react'
import '../styles/TaskForm.css'

const TaskForm = ({ onAdd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskImage, setNewTaskImage] = useState('')
  const [newTaskImage2, setNewTaskImage2] = useState('') // Added second image state
  const [newTaskGenres, setNewTaskGenres] = useState('')
  const [newTaskThemes, setNewTaskThemes] = useState('')
  const [newTaskScore, setNewTaskScore] = useState('')

  const handleAddTask = async e => {
    e.preventDefault()
    if (!newTaskTitle) return

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      image: newTaskImage,
      image2: newTaskImage2, // Include second image
      genres: newTaskGenres.split(',').map(genre => genre.trim()), // Converting to an array
      themes: newTaskThemes.split(',').map(theme => theme.trim()), // Converting to an array
      yourScore: newTaskScore ? Number(newTaskScore) : 0 // Ensure it's a number
    }
    if (!newTask.parentTaskId) {
      delete newTask.parentTaskId
    }

    const task = await onAdd(newTask)
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskImage('')
    setNewTaskImage2('') // Reset second image state
    setNewTaskGenres('')
    setNewTaskThemes('')
    setNewTaskScore('')

    return task
  }

  return (
    <form className='task-form' onSubmit={handleAddTask}>
      <div className='form-group'>
        <label htmlFor='taskTitle'>Task Title</label>
        <input
          id='taskTitle'
          className='task-input'
          type='text'
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder='Enter new task title'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='taskDescription'>Task Description</label>
        <textarea
          id='taskDescription'
          className='task-input'
          value={newTaskDescription}
          onChange={e => setNewTaskDescription(e.target.value)}
          placeholder='Enter task description'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='taskImage'>Image URL</label>
        <input
          id='taskImage'
          className='task-input'
          type='text'
          value={newTaskImage}
          onChange={e => setNewTaskImage(e.target.value)}
          placeholder='Enter image URL'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='taskImage2'>Second Image URL</label>
        <input
          id='taskImage2'
          className='task-input'
          type='text'
          value={newTaskImage2}
          onChange={e => setNewTaskImage2(e.target.value)}
          placeholder='Enter second image URL'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='taskGenres'>Genres</label>
        <input
          id='taskGenres'
          className='task-input'
          type='text'
          value={newTaskGenres}
          onChange={e => setNewTaskGenres(e.target.value)}
          placeholder='Enter genres (comma separated)'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='taskThemes'>Themes</label>
        <input
          id='taskThemes'
          className='task-input'
          type='text'
          value={newTaskThemes}
          onChange={e => setNewTaskThemes(e.target.value)}
          placeholder='Enter themes (comma separated)'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='taskScore'>Your Score</label>
        <input
          id='taskScore'
          className='task-input'
          type='number'
          value={newTaskScore}
          onChange={e => setNewTaskScore(e.target.value)}
          placeholder='Enter your score'
        />
      </div>

      <button className='task-form-btn' type='submit'>
        Add Task
      </button>
    </form>
  )
}

export default TaskForm
