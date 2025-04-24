import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from '../models/messageModel.js'

const users = new Map()

export default function setupSocket (server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  // ✅ AUTH FIRST
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication error'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = decoded
      console.log('Authenticated socket user:', socket.user) // dDebug
      next()
    } catch (err) {
      next(new Error('Authentication failed'))
    }
  })

  // ✅ HANDLERS AFTER AUTH
  io.on('connection', socket => {
    console.log('🟢 Connected:', socket.id)
    console.log('Current user in socket connection:', socket.user)

    users.set(socket.user.userId || socket.user._id, socket.id)

    socket.on('chatMessage', async ({ to, text }) => {
      const from = socket.user.userId || socket.user._id

      console.log('💬 Received message from client:', {
        from,
        to,
        text
      })

      const newMsg = new Message({
        from,
        to,
        message: text,
        timestamp: new Date()
      })
      await newMsg.save()

      const msgPayload = { from, to, message: text }
      console.log('🔍 Sending message to target:', msgPayload)

      const targetSocketId = users.get(to)

      // const senderSocketId = users.get(from)

      // 🔄 Send to recipient
      if (targetSocketId) {
        io.to(targetSocketId).emit('chatMessage', msgPayload)
      }

      // 🔁 ALSO send to sender (echo back)
      // if (senderSocketId) {
      //   io.to(senderSocketId).emit('chatMessage', msgPayload)
      // }
      console.log('🔍 Sending message to target:', msgPayload)
    })

    socket.on('disconnect', () => {
      users.delete(socket.user.id)
      console.log('🔴 Disconnected:', socket.id)
    })
  })
}
