import express from 'express'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Check if user/email exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email or username already exists' })
    }

    // Validate password strength
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/.test(password)) {
      return res.status(400).json({
        message:
          'Password must be 6-16 characters, include a number, and an uppercase letter'
      })
    }

    // Create new user
    const newUser = new User({ username, email, password })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Login Route
router.post('/login', async (req, res) => {
  console.log('🔍 Incoming Login Request:', req.body) // Log request body
  try {
    console.log('Request Body:', req.body) // Debugging line
    const { username, password } = req.body

    // Check if user exists
    const user = await User.findOne({ username })

    if (!user) {
      console.log(`User not found with username: ${username}`) // More detailed error log

      return res.status(400).json({ message: 'Invalid credentials' })
    }
    console.log('✅ User Found:', user.email) // Log found user
    console.log('User found:', user)

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log('❌ Password Mismatch')
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    console.log('Password match successful')
    console.log('✅ Password Matched, Generating Token...')
    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    console.log('🔑 Token Generated:', token) // Log token
    res.status(200).json({ token, username: user.username })
  } catch (error) {
    console.error('Error in login route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
