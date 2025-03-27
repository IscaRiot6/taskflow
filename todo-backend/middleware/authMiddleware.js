import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  // Log the entire Authorization header for debugging
  console.log('Authorization header:', req.header('Authorization'))
  const token = req.header('Authorization')?.replace('Bearer ', '')
  console.log('Received token:', token) // Debugging log
  if (!token)
    return res.status(401).json({ message: 'Access denied. No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded) // Debugging log
    req.user = decoded // Attach user info to request
    next()
  } catch (error) {
    console.log('Error verifying token:', error) // Debugging log
    res.status(400).json({ message: 'Invalid token' })
  }
}

export default authMiddleware
