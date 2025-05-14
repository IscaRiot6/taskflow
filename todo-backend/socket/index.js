import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'

const users = new Map() // Map<userId, Set<socket.id>>

function setupSocket (server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  // ✅ AUTHENTICATION MIDDLEWARE
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication error'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = decoded
      next()
    } catch (err) {
      next(new Error('Authentication failed'))
    }
  })

  // ✅ CONNECTION HANDLER
  io.on('connection', socket => {
    const userId = socket.user.userId || socket.user._id
    socket.userId = userId

    if (!users.has(userId)) {
      users.set(userId, new Set())
    }
    users.get(userId).add(socket.id)

    // If this is the first connection, mark user as online
    if (users.get(userId).size === 1) {
      User.findByIdAndUpdate(userId, { online: true }, { new: true })
        .populate('friends', '_id username')
        .then(user => {
          console.log(`User ${user.username} is now online`)
          io.emit('user-status-update', { userId, online: true })

          // Notify online friends
          user.friends.forEach(friend => {
            const friendSockets = users.get(friend._id.toString())
            if (friendSockets) {
              friendSockets.forEach(socketId => {
                io.to(socketId).emit('friend-online', {
                  friendId: user._id,
                  username: user.username
                })
              })
            }
          })
        })
    }

    // ✅ MESSAGE HANDLER
    socket.on('chatMessage', async ({ to, text }) => {
      const from = socket.user.userId || socket.user._id

      const newMsg = new Message({
        from,
        to,
        message: text,
        timestamp: new Date()
      })
      await newMsg.save()

      const msgPayload = { from, to, message: text }

      const targetSockets = users.get(to)
      if (targetSockets) {
        for (const socketId of targetSockets) {
          io.to(socketId).emit('chatMessage', msgPayload)
        }
      }

      // Optionally, emit the message back to the sender
      const senderSockets = users.get(from)
      if (senderSockets) {
        for (const socketId of senderSockets) {
          io.to(socketId).emit('chatMessage', msgPayload)
        }
      }
    })

    // ✅ DISCONNECT HANDLER
    socket.on('disconnect', () => {
      const userSockets = users.get(userId)
      if (userSockets) {
        userSockets.delete(socket.id)
        if (userSockets.size === 0) {
          users.delete(userId)
          User.findByIdAndUpdate(userId, { online: false }, { new: true }).then(
            user => {
              console.log(`User ${user.username} is now offline`)
              io.emit('user-status-update', { userId, online: false })
            }
          )
        }
      }
    })
  })
}

export default setupSocket
