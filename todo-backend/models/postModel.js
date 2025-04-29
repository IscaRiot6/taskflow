import mongoose from 'mongoose'

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  votes: { type: Number, default: 0 },
  voters: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      voteType: { type: String, enum: ['up', 'down'] }
    }
  ],

  tags: [{ type: String }]
})

export default mongoose.model('Post', postSchema)
