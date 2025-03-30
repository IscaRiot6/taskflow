import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    console.log('Authorization header:', authHeader)

    // Ensure the token exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Access denied. No valid token provided' })
    }

    // Extract and verify the token
    const token = authHeader.replace('Bearer ', '').trim()
    console.log('Received token:', token)

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded)

    req.user = decoded // Attach user info to request
    next()
  } catch (error) {
    console.log('Error verifying token:', error.message)

    // Handle different JWT errors specifically
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again' })
    }

    res.status(500).json({ message: 'Server error' })
  }
}

export default authMiddleware
