import express from 'express'
import Task from '../models/taskModel.js'
import User from '../models/userModel.js' // ✅ Include User model
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// ✅ Protect all routes with authentication
router.use(authMiddleware)

// ✅ Get related tasks (GET)
router.get('/:taskId', async (req, res) => {
  const { taskId } = req.params

  try {
    const task = await Task.findOne({
      _id: taskId,
      user: req.user.userId
    }).populate('relatedTasks')
    if (!task)
      return res.status(404).json({ error: 'Task not found or unauthorized' })

    res.json(task.relatedTasks) // ✅ Ensure only the user's related tasks are fetched
  } catch (error) {
    console.error('Error fetching related tasks:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// ✅ Add a related task (POST)
router.post('/:taskId', async (req, res) => {
  const { taskId } = req.params
  const { title, description, image, image2, genres, themes, yourScore } =
    req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' })
  }

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.userId })
    if (!task)
      return res.status(404).json({ error: 'Task not found or unauthorized' })

    // ✅ Ensure the logged-in user exists
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // ✅ Create a related task under the logged-in user
    const newRelatedTask = new Task({
      title,
      description,
      image,
      image2,
      genres,
      themes,
      yourScore,
      user: req.user.userId // ✅ Ensure it belongs to the logged-in user
    })

    const savedTask = await newRelatedTask.save()

    // ✅ Store the related task reference in the parent task
    task.relatedTasks.push(savedTask._id)
    await task.save()

    // ✅ Store the related task in the user's profile
    user.tasks.push(savedTask._id)
    await user.save()

    res
      .status(201)
      .json({ message: 'Related task created', relatedTask: savedTask })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// ✅ Update a related task (PUT)
router.put('/:taskId/:relatedId', async (req, res) => {
  const { taskId, relatedId } = req.params
  const { title, description, image, image2, genres, themes, yourScore } =
    req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' })
  }

  try {
    // Step 1: Find the parent task
    const task = await Task.findOne({ _id: taskId, user: req.user.userId })
    if (!task)
      return res
        .status(404)
        .json({ error: 'Parent task not found or unauthorized' })

    // Step 2: Find the related task to update
    const relatedTask = await Task.findOne({
      _id: relatedId,
      user: req.user.userId
    })
    if (!relatedTask)
      return res
        .status(404)
        .json({ error: 'Related task not found or unauthorized' })

    // Step 3: Update the related task fields
    relatedTask.title = title
    relatedTask.description = description || relatedTask.description
    relatedTask.image = image || relatedTask.image
    relatedTask.image2 = image2 || relatedTask.image2
    relatedTask.genres = genres || relatedTask.genres
    relatedTask.themes = themes || relatedTask.themes
    relatedTask.yourScore = yourScore || relatedTask.yourScore

    const updatedTask = await relatedTask.save()

    res.status(200).json({
      message: 'Related task updated successfully',
      relatedTask: updatedTask
    })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// ✅ Delete a related task (DELETE)
router.delete('/:taskId/:relatedId', async (req, res) => {
  const { taskId, relatedId } = req.params

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.userId })
    if (!task)
      return res.status(404).json({ error: 'Task not found or unauthorized' })

    // ✅ Remove the related task reference
    task.relatedTasks = task.relatedTasks.filter(
      id => id.toString() !== relatedId
    )
    await task.save()

    // ✅ Delete the related task itself (ONLY for this user)
    const deletedTask = await Task.findOneAndDelete({
      _id: relatedId,
      user: req.user.userId
    })
    if (!deletedTask)
      return res.status(404).json({ error: 'Related task not found' })

    // ✅ Remove from user's tasks array
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { tasks: relatedId }
    })

    res.json({ message: 'Related task deleted' })
  } catch (error) {
    console.error('Error deleting related task:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
