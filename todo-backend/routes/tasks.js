import express from 'express'
import Task from '../models/taskModel.js' // Import your Task model
const router = express.Router()

// ✅ Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find() // Fetch tasks from MongoDB
    console.log('📋 Fetching all tasks:', tasks)
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Fetch related tasks for a specific task
router.get('/:id/related', async (req, res) => {
  const taskId = req.params.id // Extract the task ID
  console.log(`Fetching related tasks for task ID: ${taskId}`) // Log task ID

  try {
    const task = await Task.findById(taskId).populate('relatedTasks') // ✅ Populate related tasks

    if (!task) {
      console.log(`Task with ID ${taskId} not found.`)
      return res.status(404).json({ error: 'Task not found' })
    }

    console.log(`Found task:`, task) // Log the full task object

    // Checking if relatedTasks is populated correctly
    if (task.relatedTasks && task.relatedTasks.length > 0) {
      console.log(`Related tasks array:`, task.relatedTasks) // Log the populated related tasks array
      res.json(task.relatedTasks) // Return populated related tasks
    } else {
      console.log(`No related tasks found for task ID: ${taskId}`)
      res.status(404).json({ error: 'No related tasks found' })
    }
  } catch (error) {
    console.error(`Error fetching related tasks for ID ${taskId}:`, error)
    res.status(500).json({ error: 'Failed to fetch related tasks' })
  }
})

// ✅ Add a new task (POST)
router.post('/', async (req, res) => {
  try {
    const { title, description, image, genres, themes, yourScore } = req.body
    const newTask = new Task({
      title,
      description,
      image,
      genres,
      themes,
      yourScore
    })
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' })
  }
})

// ✅ Update a task (PUT)
router.put('/:id', async (req, res) => {
  const taskId = req.params.id // Get the task ID from the URL
  const { title, description, image, genres, themes, yourScore, completed } =
    req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Updated task title is required' })
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title.trim(),
        description: description?.trim() || '',
        image: image || '',
        genres: genres || [],
        themes: themes || [],
        yourScore: yourScore || null,
        completed: completed ?? false
      },
      { new: true, runValidators: true } // Return the updated task and validate
    )

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    console.log('✅ Task updated:', updatedTask)
    res.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// ✅ Delete a task (DELETE)
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id
  console.log(`🗑 Deleting task with ID: ${taskId}`)

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId) // Delete the task from MongoDB

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    console.log(`✅ Task deleted:`, deletedTask)
    res.status(204).send() // No content
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// Export router as default
export default router
