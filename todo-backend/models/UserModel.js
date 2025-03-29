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
  // Add a reference to the tasks collection
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task' // Referencing the Task model
    }
  ]
  // favouriteTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
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
