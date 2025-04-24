import React, { useEffect, useState, useRef } from 'react'
import socket from '../../socket/socket'
// ORIGINAL
import './ChatWindow.css'

const ChatWindow = ({ currentUser, friend }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const fetchHistory = async () => {
    try {
      if (!currentUser || !friend) {
        console.error('⚠️ Missing currentUser or friend')
        return
      }

      const res = await fetch(
        `http://localhost:5000/api/messages/${currentUser._id}/${friend._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      )

      if (!res.ok) {
        const errorText = await res.text()
        console.error(`⚠️ Failed to fetch messages (${res.status}):`, errorText)
        throw new Error(`Failed to fetch messages: ${errorText}`)
      }

      // Log the response before parsing
      const responseText = await res.text()
      console.log('📄 Raw response:', responseText) // Log raw response for debugging

      // Try parsing the response text as JSON
      const data = JSON.parse(responseText)
      console.log('📜 History from DB:', data)
      setMessages(prev => [...prev, ...data])
    } catch (err) {
      console.error('⚠️ Error fetching chat history:', err)
    }
  }

  useEffect(() => {
    if (currentUser && friend) {
      setMessages([]) // 💥 Clear previous messages
      fetchHistory()
    }
  }, [currentUser, friend])

  socket.onAny((event, ...args) => {
    console.log(`📡 Socket event: ${event}`, args)
  })

  useEffect(() => {
    if (!currentUser?._id || !friend?._id) {
      console.warn('❌ Skipping socket setup: IDs missing')
      return
    }

    console.log('🛠️ Setting up chatMessage socket listener')

    const handleMessage = msg => {
      console.log('📥 Received msg:', msg)

      const msgFrom = msg.from?.toString()
      const msgTo = msg.to?.toString()
      const userId = currentUser._id.toString()
      const friendId = friend._id.toString()

      const isRelevant =
        (msgFrom === userId && msgTo === friendId) ||
        (msgFrom === friendId && msgTo === userId)

      if (isRelevant) {
        setMessages(prev => [...prev, msg])
      } else {
        console.log('📤 Ignored message not for this chat:', msg)
      }
    }

    socket.on('chatMessage', handleMessage)

    return () => {
      socket.off('chatMessage', handleMessage)
    }
  }, [currentUser?._id, friend?._id])

  const sendMessage = () => {
    if (input.trim()) {
      console.log('🛫 Sending message:', {
        from: currentUser?._id,
        to: friend?._id,
        text: input
      })

      socket.emit('chatMessage', {
        from: currentUser?._id, // telika ti tha ginei me auto
        to: friend?._id,
        text: input
      })
      setInput('')
    }
  }

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    console.log('💡 useEffect triggered with:', {
      currentUserLoaded: !!currentUser,
      friendLoaded: !!friend
    })
  }, [currentUser, friend])

  useEffect(() => {
    console.log('💬 Current messages array:', messages)
  }, [messages])

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        💬 Chat with <strong>{friend?.username}</strong>
      </div>

      <div className='chat-messages'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${
              msg.from === currentUser._id ? 'sent' : 'received'
            }`}
          >
            <span className='chat-bubble'>
              {msg.message || msg.text || '[no content]'}
            </span>
            {/* <span className="timestamp">
  {new Date(msg.createdAt).toLocaleTimeString()}
</span> */}
          </div>
        ))}
      </div>

      <div className='chat-input-bar'>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Type a message...'
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>📤</button>
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatWindow
