import React, { useEffect, useState } from 'react'
import '../styles/FriendsPanel.css'
import MutualFriendsModal from '../components/MutualFriendsModal'
import FriendActions from './FriendActions'
import FriendCard from './FriendCard'
import ChatModal from './Chat/ChatModal'
import { useNavigate } from 'react-router-dom'

const FriendsPanel = () => {
  const [modalUserId, setModalUserId] = useState(null)
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFriend, setSelectedFriend] = useState(null) //GIA PAME PAPA
  const [showChatModal, setShowChatModal] = useState(false) //GIA PAME
  const [currentUser, setCurrentUser] = useState(null)
  // const [unseenMap, setUnseenMap] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        console.warn('User not found in localStorage → redirecting')
        navigate('/login')
        return
      }

      const parsedUser = JSON.parse(storedUser)
      if (!parsedUser || !parsedUser._id) {
        throw new Error('Invalid user object in localStorage')
      }

      setCurrentUser(parsedUser)
    } catch (err) {
      console.error('❌ Failed to load user from localStorage:', err)
      localStorage.removeItem('user')
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    console.log('🔁 currentUser loaded:', currentUser)
  }, [currentUser])

  const handleOpenChat = friend => {
    if (!currentUser) {
      console.warn("⛔ Can't open chat before user is loaded")
      return
    }
    setSelectedFriend(friend)
  }

  useEffect(() => {
    if (selectedFriend && currentUser) {
      setShowChatModal(true)
    }
  }, [selectedFriend, currentUser])

  const handleCloseChat = () => {
    setShowChatModal(false)
    setSelectedFriend(null)
  }
  console.log('🧠 Opening chat modal for:', currentUser, selectedFriend)

  const token = localStorage.getItem('authToken')

  

  const fetchData = async () => {
    try {
      const [usersRes, friendsRes, sentRes, receivedRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/friends/list`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/friends/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/friends/pending/sent`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/friends/pending/received`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      ])

      const usersData = await usersRes.json()
      const friendsData = await friendsRes.json()
      const sentData = await sentRes.json()
      const receivedData = await receivedRes.json()

      setUsers(usersData)
      setFriends(friendsData)
      setSentRequests(sentData)
      setReceivedRequests(receivedData)
    } catch (err) {
      console.error('Error fetching friends data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleSendRequest = async friendId => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/send-request/${friendId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchData()
    } catch (err) {
      console.error('Error sending friend request', err)
    }
  }

  const handleAcceptRequest = async friendId => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/accept-request/${friendId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchData()
    } catch (err) {
      console.error('Error accepting friend request', err)
    }
  }

  const handleRejectRequest = async friendId => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/reject-request/${friendId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchData()
    } catch (err) {
      console.error('Error rejecting friend request', err)
    }
  }

  const handleRemoveFriend = async friendId => {
    const confirm = window.confirm(
      'Are you sure you want to remove this friend?'
    )

    if (!confirm) return

    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/remove-friend/${friendId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      fetchData() // Refresh updated friend list
    } catch (err) {
      console.error('Error removing friend', err)
    }
  }

  const isFriend = id => friends.some(friend => friend._id === id)
  const isSent = id => sentRequests.some(user => user._id === id)
  const isReceived = id => receivedRequests.some(user => user._id === id)

  if (!currentUser) {
    console.log('🕒 Waiting for currentUser...')
    return <div>Loading your profile...</div>
  }

  return (
    <div className='profile__friends-panel'>
      <h3 className='friends-panel__heading'>Find and Add Friends</h3>

      {loading ? (
        <p className='friends-panel__loading'>Loading friends...</p>
      ) : (
        <ul className='friends-panel__list'>
          {users.map(user => (
            <FriendActions
              key={user._id}
              user={user}
              isFriend={isFriend}
              isSent={isSent}
              isReceived={isReceived}
              handleSendRequest={handleSendRequest}
              handleAcceptRequest={handleAcceptRequest}
              handleRejectRequest={handleRejectRequest}
              setModalUserId={setModalUserId}
            />
          ))}
        </ul>
      )}

      <h3 className='friends-panel__heading'>Your Friends</h3>
      <ul className='friends-panel__list'>
        {friends.map(friend => (
          <FriendCard
            key={friend._id}
            friend={friend}
            onClick={() => handleOpenChat(friend)}
            currentUser={currentUser} // ✅ this fixes the issue PROSOXH EDW
            handleOpenChat={handleOpenChat} // PAPPAPAPAA
            handleRemoveFriend={handleRemoveFriend}
          />
        ))}
        {showChatModal && selectedFriend && (
          <ChatModal
            currentUser={currentUser}
            friend={selectedFriend}
            onClose={handleCloseChat}
          />
        )}
      </ul>
      <MutualFriendsModal
        open={!!modalUserId}
        userId={modalUserId}
        onClose={() => setModalUserId(null)}
      />
    </div>
  )
}

export default FriendsPanel
