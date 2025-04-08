import React, { useEffect, useState } from 'react'
import '../styles/FriendsPanel.css'
import MutualFriendsModal from '../components/MutualFriendsModal' // Adjust path if needed

const FriendsPanel = () => {
  const [modalUserId, setModalUserId] = useState(null)
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [mutualFriendsMap, setMutualFriendsMap] = useState({})
  const [expandedMutuals, setExpandedMutuals] = useState({})

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

  const fetchMutualFriends = async otherUserId => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/mutual/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = await res.json()
      console.log('Mutual Friends:', data)
      // Optionally update state to show in the UI
    } catch (err) {
      console.error('Error fetching mutual friends', err)
    }
  }

  const toggleMutualFriends = async userId => {
    const isExpanded = expandedMutuals[userId]

    if (!isExpanded) {
      // Fetch only if not already fetched
      if (!mutualFriendsMap[userId]) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/friends/mutual/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
          const data = await res.json()
          setMutualFriendsMap(prev => ({ ...prev, [userId]: data }))
        } catch (err) {
          console.error('Error loading mutual friends', err)
        }
      }
    }

    setExpandedMutuals(prev => ({ ...prev, [userId]: !isExpanded }))
  }

  const isFriend = id => friends.some(friend => friend._id === id)
  const isSent = id => sentRequests.some(user => user._id === id)
  const isReceived = id => receivedRequests.some(user => user._id === id)

  const renderUserActions = user => {
    const id = user._id

    if (isFriend(id)) {
      return (
        <>
          <span className='friends-panel__status'>✅ Friend</span>

          <button
            className='friends-panel__toggle-mutuals'
            onClick={() => {
              toggleMutualFriends(id)
              setModalUserId(id)
            }}
          >
            👥 View Mutual Friends
          </button>
        </>
      )
    }

    if (isSent(id)) {
      return <span className='friends-panel__status'>⏳ Pending</span>
    }

    if (isReceived(id)) {
      return (
        <>
          <button
            onClick={() => handleAcceptRequest(id)}
            className='friends-panel__add-button'
          >
            ✅ Accept
          </button>
          <button
            onClick={() => handleRejectRequest(id)}
            className='friends-panel__add-button friends-panel__reject'
          >
            ❌ Reject
          </button>
        </>
      )
    }

    return (
      <button
        className='friends-panel__add-button'
        onClick={() => handleSendRequest(id)}
      >
        ➕ Add Friend
      </button>
    )
  }

  return (
    <div className='profile__friends-panel'>
      <h3 className='friends-panel__heading'>Find and Add Friends</h3>

      {loading ? (
        <p className='friends-panel__loading'>Loading friends...</p>
      ) : (
        <ul className='friends-panel__list'>
          {users.map(user => (
            <li key={user._id} className='friends-panel__item'>
              <img
                src={user.profilePic || null}
                alt=''
                className='friends-panel__avatar'
                onError={e => {
                  e.target.onerror = null
                  e.target.src = '/default-avatar.png'
                }}
              />
              <span className='friends-panel__username'>{user.username}</span>
              {renderUserActions(user)}
            </li>
          ))}
        </ul>
      )}

      <h3 className='friends-panel__heading'>Your Friends</h3>
      <ul className='friends-panel__list'>
        {friends.map(friend => (
          <li key={friend._id} className='friends-panel__item'>
            <img
              src={friend.profilePic}
              alt=''
              className='friends-panel__avatar'
            />
            <span className='friends-panel__username'>{friend.username}</span>
            <button
              className='friends-panel__add-button friends-panel__reject'
              onClick={() => handleRemoveFriend(friend._id)}
            >
              ❌ Remove friend
            </button>
          </li>
        ))}
      </ul>
      <MutualFriendsModal
        open={!!modalUserId}
        onClose={() => setModalUserId(null)}
        mutuals={mutualFriendsMap[modalUserId] || []}
      />
    </div>
  )
}

export default FriendsPanel
