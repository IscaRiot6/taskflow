import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // New fields:
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '' // Could be a URL to the image
  },

  genres: {
    type: [String],
    default: [] // An array of strings
  },
  themes: {
    type: [String],
    default: [] // An array of strings
  },
  yourScore: {
    type: Number,
    default: 0 // You can change the default if needed
  },
  // Existing fields:
  completed: {
    type: Boolean,
    default: false
  },
  relatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Task = mongoose.model('Task', taskSchema)

export default Task
