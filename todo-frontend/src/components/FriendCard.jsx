import React, { useState, useEffect } from 'react'
import ChatWindow from './Chat/ChatWindow'
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import socket from './../socket/socket'
import { toast } from 'react-toastify';



const FriendCard = ({ friend, currentUser, handleRemoveFriend, handleOpenChat,  unseenCount }) => {
  const [showChat, setShowChat] = useState(false)
  const [onlineStatus, setOnlineStatus] = useState(false);

  
  useEffect(() => {
    const fetchOnlineStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/online/${friend._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        setOnlineStatus(data.online);
      } catch (error) {
        console.error('Error fetching online status:', error);
      }
    };

    fetchOnlineStatus();
  }, [friend._id]);

  useEffect(() => {
    const handleStatusUpdate = ({ userId, online }) => {
      console.log(`Status update received for userId: ${userId}, online: ${online}`);
      if (userId === friend._id) {
        console.log(`Updating online status for friend: ${friend.username}`);
        setOnlineStatus(online);
      }
    };
  
    socket.on('user-status-update', handleStatusUpdate);
  
    return () => {
      socket.off('user-status-update', handleStatusUpdate);
    };
  }, [socket, friend._id]);
  
  // add an event listener for the friend-online event to display a notification when a friend comes online
  // useEffect(() => {
  //   const handleFriendOnline = ({ friendId, username }) => {
  //     if (friendId === friend._id) {
  //       // Display a notification or update the UI accordingly
  //       alert(`Your friend ${username} is now online`);
  //     }
  //   };

  useEffect(() => {
    const handleFriendOnline = ({ friendId, username }) => {
      if (friendId === friend._id) {
        toast.info(`Your friend ${username} is now online!`);
      }
    };

    
  
    socket.on('friend-online', handleFriendOnline);
  
    return () => {
      socket.off('friend-online', handleFriendOnline);
    };
  }, [friend._id]);
  

  return (
    <li className={`friends-panel__item  ${onlineStatus ? 'online' : 'offline'}`}>
      <img
        src={friend.profilePic}
        alt=''
        className='friends-panel__avatar'
        onError={e => {
          e.target.onerror = null;
          e.target.src = '/default-avatar.png';
        }}
      />
      <a href={`/profile/${friend._id}`} className='friends-panel__username-link'>
        {friend.username} 🔗
      </a>
      <span className={`status-indicator ${onlineStatus ? 'green' : 'red'}`}></span>

      <button
        className='friends-panel__add-button friends-panel__reject'
        onClick={() => handleRemoveFriend(friend._id)}
      >
        ❌ Remove friend
      </button>

      <button className='friends-panel__add-button' onClick={() => handleOpenChat(friend)}>
        <Badge badgeContent={unseenCount} color='success'>
          <MailIcon />
        </Badge>
      </button>

      {showChat && <ChatWindow currentUser={currentUser} friend={friend} />}
    </li>
  );
}

export default FriendCard
