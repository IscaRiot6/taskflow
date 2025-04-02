import { useState } from 'react'
import '../styles/RelatedTaskForm.css'

const RelatedTaskForm = ({ onAdd, parentTaskId }) => {
  const [relatedTaskTitle, setRelatedTaskTitle] = useState('')
  const [relatedTaskDescription, setRelatedTaskDescription] = useState('')
  const [relatedTaskImage, setRelatedTaskImage] = useState('')
  const [relatedTaskImage2, setRelatedTaskImage2] = useState('')
  const [relatedTaskGenres, setRelatedTaskGenres] = useState('')
  const [relatedTaskThemes, setRelatedTaskThemes] = useState('')
  const [relatedTaskScore, setRelatedTaskScore] = useState('')

  const handleAdd = async e => {
    console.log('onAdd function:', onAdd) // 👀 Check if it's undefined
    console.log('Parent Task ID:', parentTaskId)

    e.preventDefault()
    if (!relatedTaskTitle) return

    const newRelatedTask = {
      title: relatedTaskTitle,
      description: relatedTaskDescription,
      image: relatedTaskImage,
      image2: relatedTaskImage2,
      genres: relatedTaskGenres.split(',').map(genre => genre.trim()),
      themes: relatedTaskThemes.split(',').map(theme => theme.trim()),
      yourScore: relatedTaskScore ? Number(relatedTaskScore) : 0,
      parentTaskId: parentTaskId || null // Optional linking
    }

    // await onAdd(newRelatedTask)
    console.log('Submitting new task:', newRelatedTask)
    // const task = await onAdd(newRelatedTask)
    // if (!task) {
    //   console.error('Task creation failed')
    // }
    const createdTask = await onAdd(newRelatedTask) // ✅ Handle response
    console.log('Created Task:', createdTask)

    if (!createdTask) {
      console.error('Task creation failed')
      return
    }

    setRelatedTaskTitle('')
    setRelatedTaskDescription('')
    setRelatedTaskImage('')
    setRelatedTaskImage2('')
    setRelatedTaskGenres('')
    setRelatedTaskThemes('')
    setRelatedTaskScore('')

    // return task
  }

  return (
    <form className='related-task-form' onSubmit={handleAdd}>
      {/* Header with subtle differentiation */}
      <div className='related-task-form-header'>
        <h2>
          <span className='link-icon'>🔗</span> Related Task Form
        </h2>
      </div>

      {/* Optional: Display Parent Task ID if it exists */}
      {parentTaskId && (
        <div className='form-group'>
          <label htmlFor='parentTaskId'>Linked to Task ID</label>
          <input
            id='parentTaskId'
            className='related-task-input'
            type='text'
            value={parentTaskId}
            readOnly
          />
        </div>
      )}

      <div className='form-group'>
        <label htmlFor='relatedTaskTitle'>Related Task Title</label>
        <input
          id='relatedTaskTitle'
          className='related-task-input'
          type='text'
          value={relatedTaskTitle}
          onChange={e => setRelatedTaskTitle(e.target.value)}
          placeholder='Enter related task title'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='relatedTaskDescription'>Task Description</label>
        <textarea
          id='relatedTaskDescription'
          className='related-task-input'
          value={relatedTaskDescription}
          onChange={e => setRelatedTaskDescription(e.target.value)}
          placeholder='Enter related task description'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='relatedTaskImage'>Image URL</label>
        <input
          id='relatedTaskImage'
          className='related-task-input'
          type='text'
          value={relatedTaskImage}
          onChange={e => setRelatedTaskImage(e.target.value)}
          placeholder='Enter image URL'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='relatedTaskImage2'>Second Image URL</label>
        <input
          id='relatedTaskImage2'
          className='related-task-input'
          type='text'
          value={relatedTaskImage2}
          onChange={e => setRelatedTaskImage2(e.target.value)}
          placeholder='Enter second image URL'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='relatedTaskGenres'>Genres</label>
        <input
          id='relatedTaskGenres'
          className='related-task-input'
          type='text'
          value={relatedTaskGenres}
          onChange={e => setRelatedTaskGenres(e.target.value)}
          placeholder='Enter genres (comma separated)'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='relatedTaskThemes'>Themes</label>
        <input
          id='relatedTaskThemes'
          className='related-task-input'
          type='text'
          value={relatedTaskThemes}
          onChange={e => setRelatedTaskThemes(e.target.value)}
          placeholder='Enter themes (comma separated)'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='relatedTaskScore'>Your Score</label>
        <input
          id='relatedTaskScore'
          className='related-task-input'
          type='number'
          value={relatedTaskScore}
          onChange={e => setRelatedTaskScore(e.target.value)}
          placeholder='Enter your score'
        />
      </div>

      <button className='related-task-form-btn' type='submit'>
        Add Related Task
      </button>
    </form>
  )
}

export default RelatedTaskForm
