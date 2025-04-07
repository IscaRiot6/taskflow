import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure unique usernames
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique emails
    trim: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Basic email regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    maxlength: 350,
    default: ''
  },
  profilePic: {
    // ✅ ADD THIS
    type: String,
    default: '' // Optional: Set a default empty string or a placeholder URL
  },
  settings: {
    darkMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true }
  },
  // Add a reference to the tasks collection
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task' // Referencing the Task model
    }
  ],
  favoriteTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  history: [
    {
      action: { type: String, required: true }, // e.g., "Added Task", "Deleted Task"
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: false
      },
      taskTitle: { type: String, required: false },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
