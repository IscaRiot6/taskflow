import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI) // Log the URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected successfully!')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
