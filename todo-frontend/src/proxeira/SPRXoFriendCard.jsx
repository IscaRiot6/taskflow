import React, { useState } from 'react'
import ChatWindow from './Chat/ChatWindow'
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';


const FriendCard = ({ friend, currentUser, handleRemoveFriend, handleOpenChat,  unseenCount }) => {
  const [showChat, setShowChat] = useState(false)
  

  return (
    <li className='friends-panel__item'>
      <img
        src={friend.profilePic}
        alt=''
        className='friends-panel__avatar'
        onError={e => {
          e.target.onerror = null;
          e.target.src = '/default-avatar.png';
        }}
      />
      <a
        href={`/profile/${friend._id}`}
        className='friends-panel__username-link'
      >
        {friend.username} 🔗
      </a>

      <button
        className='friends-panel__add-button friends-panel__reject'
        onClick={() => handleRemoveFriend(friend._id)}
      >
        ❌ Remove friend
      </button>

      <button
        className='friends-panel__add-button'
        onClick={() => handleOpenChat(friend)}
      >
        <Badge badgeContent={unseenCount} color="success">
          <MailIcon />
        </Badge>
      </button>

      {showChat && (
        <ChatWindow currentUser={currentUser} friend={friend} />
      )}
    </li>
  );
}

export default FriendCard
