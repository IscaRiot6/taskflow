import React from 'react'
import '../styles/Notification.css'

const Notification = ({ message, type }) => {
  return <div className={`notification ${type}`}>{message}</div>
}

export default Notification
