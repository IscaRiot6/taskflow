import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
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
    image2: {
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
      default: null // might as well turn it as a base 0 number
    },
    // Existing fields:
    completed: {
      type: Boolean,
      default: false
    },
    relatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    }, // ✅ New field

    // The user reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true
    }
  },
  {
    timestamps: true // This will automatically add createdAt and updatedAt fields
  }
)

const Task = mongoose.model('Task', taskSchema)

export default Task
