import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId },
  to: { type: mongoose.Schema.Types.ObjectId },
  message: String,
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('Message', messageSchema)
