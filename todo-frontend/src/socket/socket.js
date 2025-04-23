import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  auth: {
    token: localStorage.getItem('authToken')
  }
})

socket.on('connect', () => {
  console.log('🟢 Socket connected on frontend:', socket.id)
})

socket.on('connect_error', err => {
  console.error('🔴 Socket connect error:', err.message)
})

export default socket
