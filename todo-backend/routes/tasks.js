import express from 'express'
import Task from '../models/taskModel.js'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'

// Apply authMiddleware to protect all routes below
router.use(authMiddleware)

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId,
      parentTaskId: { $in: [null, undefined] }
      // parentTaskId: { $exists: false } // Only parent tasks (no related tasks)
    }).populate('relatedTasks') // Populate the related tasks

    console.log('✅ Authenticated user ID:', req.user.userId)

    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// ✅ Add a new task (POST)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      image2,
      genres,
      themes,
      yourScore,
      relatedTaskIds,
      parentTaskId
    } = req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' })
    }

    console.log('Creating task:', title)

    // Build the task data
    const taskFields = {
      title,
      description,
      image,
      image2,
      genres,
      themes,
      yourScore,
      user: req.user.userId
    }
    console.log('📦 Task fields being saved:', taskFields)

    if (
      parentTaskId !== undefined &&
      parentTaskId !== null &&
      parentTaskId !== ''
    ) {
      taskFields.parentTaskId = parentTaskId
    }

    const newTask = new Task(taskFields)

    // Debug: Show relatedTaskIds if they exist
    console.log('Related Task IDs:', relatedTaskIds)

    // If related tasks are provided, add them to the new task's `relatedTasks` field
    if (relatedTaskIds && Array.isArray(relatedTaskIds)) {
      newTask.relatedTasks = relatedTaskIds
      // Add the new task to each related task's `relatedTasks` array
      await Task.updateMany(
        { _id: { $in: relatedTaskIds } },
        { $push: { relatedTasks: newTask._id } }
      )
    }

    const savedTask = await newTask.save()
    console.log('💾 Saved task in Task collection with ID:', savedTask._id)

    // Directly populate the related tasks
    await savedTask.populate('relatedTasks') // Remove the .execPopulate() method
    console.log('✅ Final task to be saved:', savedTask)

    // Ensure user exists and add the task to the user's task list
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.tasks.push(savedTask._id)
    await user.save()

    // Add history entry for the new task
    user.history.push({
      action: 'Created Task',
      taskId: savedTask._id,
      taskTitle: savedTask.title,
      timestamp: new Date()
    })
    await user.save()

    res.status(201).json(savedTask) // Return the populated task
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Error creating task' })
  }
})

// ✅ Update a task (PUT)
router.put('/:id', async (req, res) => {
  const taskId = req.params.id // Get the task ID from the URL
  const {
    title,
    description,
    image,
    image2,
    genres,
    themes,
    yourScore,
    completed,
    relatedTaskIds
  } = req.body

  try {
    // Find the task to update
    const task = await Task.findOne({ _id: taskId, user: req.user.userId })
    if (!task) {
      return res.status(404).json({
        error: 'Task not found or you are not authorized to update this task'
      })
    }

    // Prepare the data to update the task
    const updatedData = {}

    if (title && title !== task.title) updatedData.title = title.trim()
    if (description !== undefined)
      updatedData.description = description?.trim() || ''
    if (image !== undefined) updatedData.image = image || ''
    if (image2 !== undefined) updatedData.image2 = image2 || ''
    if (genres !== undefined) updatedData.genres = genres || []
    if (themes !== undefined) updatedData.themes = themes || []
    if (yourScore !== undefined) updatedData.yourScore = yourScore || null
    if (completed !== undefined) updatedData.completed = completed ?? false

    // If new related task IDs are provided, update relatedTasks
    if (relatedTaskIds && Array.isArray(relatedTaskIds)) {
      updatedData.relatedTasks = relatedTaskIds // Update with new related task IDs
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
      runValidators: true
    })

    if (!updatedTask) {
      return res.status(404).json({ error: 'Failed to update task' })
    }

    // Log the task update to user history
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.history.push({
      action: 'Updated Task',
      taskId: updatedTask._id,
      taskTitle: updatedTask.title,
      timestamp: new Date()
    })
    await user.save()

    res.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// ✅ Delete a task (DELETE)
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id
  console.log('🛑 Delete request received for task ID:', taskId) // Debug log

  try {
    // 1️⃣ Find the task BEFORE deleting it
    const taskToDelete = await Task.findOne({
      _id: taskId,
      user: req.user.userId
    })
    if (!taskToDelete) {
      console.log('⚠️ Task not found in database:', taskId)
      return res.status(404).json({ error: 'Task not found or unauthorized' })
    }

    const savedTitle = taskToDelete.title // ✅ Store title before deletion
    console.log(`📝 Task Title Preserved: "${savedTitle}"`) // Debugging log

    // 2️⃣ Delete the task
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.userId
    })

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task deletion failed' })
    }

    // 3️⃣ Remove from user's task list
    await User.findByIdAndUpdate(req.user.userId, { $pull: { tasks: taskId } })

    // 4️⃣ Add to history (with title)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          history: {
            action: 'Deleted Task',
            taskId: taskToDelete._id,
            taskTitle: taskToDelete.title, // ✅ Save title permanently
            timestamp: new Date()
          }
        }
      },
      { new: true }
    )

    console.log(
      `📜 History Entry Added:`,
      updatedUser.history[updatedUser.history.length - 1]
    ) // Debugging log
    console.log('✅ Task deleted:', deletedTask)
    res.status(204).send() // No content
  } catch (error) {
    console.error('❌ Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// // ✅ Add a task to favorites
// router.put('/:taskId/favorite', authMiddleware, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.taskId)

//     if (!task) {
//       console.error('Task not found:', taskId) // Log taskId
//       return res.status(404).json({ message: 'Task not found' })
//     }

//     // Add task ID to the users favoriteTasks array if it's not already there
//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ error: 'User not found' })

//     if (!user.favoriteTasks.includes(task._id)) {
//       user.favoriteTasks.push(task._id)
//       await user.save()

//       // ✅ Log action
//       user.history.push({
//         action: 'Added to Favorites',
//         taskId: task._id, // Correct reference
//         taskTitle: task.title, // ✅ Include title
//         timestamp: new Date()
//       })
//       await user.save()
//     }

//     res.json({ message: 'Task added to favorites' })
//   } catch (error) {
//     console.error('Error in marking task as favorite:', error) // Log error

//     res.status(500).json({ error: 'Error adding task to favorites' })
//   }
// })

// // ✅ Remove a task from favorites
// router.delete('/:taskId/favorite', authMiddleware, async (req, res) => {
//   try {
//     console.log('Attempting to delete task with ID:', req.params.taskId)
//     const task = await Task.findById(req.params.taskId)
//     console.log('Task found:', task)

//     if (!task) return res.status(404).json({ error: 'Task not found' })

//     // Remove task ID from the user's favoriteTasks array
//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ error: 'User not found' })

//     user.favoriteTasks = user.favoriteTasks.filter(id => !id.equals(task._id))
//     await user.save()

//     // ✅ Log action
//     user.history.push({
//       action: 'Removed from Favorites',
//       taskId: task._id, // ✅ Correct reference
//       taskTitle: task.title, // ✅ Include title
//       timestamp: new Date()
//     })
//     await user.save()
//     console.log('Favorite Tasks:', user.favoriteTasks)
//     console.log('Task ID:', task._id)

//     res.json({ message: 'Task removed from favorites' })
//   } catch (error) {
//     res.status(500).json({ error: 'Error removing task from favorites' })
//   }
// })

// // Fetch user's favorite tasks
// router.get('/favorites', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).populate('favoriteTasks')
//     if (!user) return res.status(404).json({ error: 'User not found' })

//     res.json(user.favoriteTasks) // Return the user's favorite tasks
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching favorite tasks' })
//   }
// })

export default router
