
import { React , useEffect }from 'react'
import ChatWindow from './ChatWindow'
import './ChatModal' // optional styling

const ChatModal = ({ currentUser, friend, onClose, onMessagesSeen }) => {
  useEffect(() => {
    if (currentUser && friend) {
      console.log("🪟 ChatModal opened with:", { currentUser, friend })
    }
  }, [currentUser, friend])

  if (!currentUser || !friend) {
    console.warn("🚧 ChatModal skipped render:", { currentUser, friend })
    return null
  }

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-window">
        <ChatWindow currentUser={currentUser} friend={friend}
        onMessagesSeen={onMessagesSeen} />
        <button className="chat-modal-close" onClick={onClose}>❌ Close</button>
      </div>
    </div>
  )
}



export default ChatModal
