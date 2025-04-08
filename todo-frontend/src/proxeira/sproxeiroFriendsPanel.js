import React, { useEffect, useState } from 'react'
import '../styles/FriendsPanel.css'

const FriendsPanel = () => {
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('authToken')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, friendsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/friends/list`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/friends/friends`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const usersData = await usersRes.json()
        const friendsData = await friendsRes.json()

        setUsers(usersData)
        setFriends(friendsData)
      } catch (err) {
        console.error('Error fetching users/friends', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleAddFriend = async friendId => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/add-friend/${friendId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      // Refresh friends list
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/friends/friends`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const updatedFriends = await res.json()
      setFriends(updatedFriends)
    } catch (err) {
      console.error('Failed to add friend', err)
    }
  }

  const isFriend = id => friends.some(friend => friend._id === id)

  return (
    <div className='profile__friends-panel'>
      <h3 className='friends-panel__heading'>Find and Add Friends</h3>

      {loading ? (
        <p className='friends-panel__loading'>Loading friends...</p>
      ) : (
        <ul className='friends-panel__list friends-panel__list--users'>
          {users.map(user => (
            <li key={user._id} className='friends-panel__item'>
              <img
                src={user.profilePic}
                alt={`${user.username}'s avatar`}
                className='friends-panel__avatar'
              />
              <span className='friends-panel__username'>{user.username}</span>
              {isFriend(user._id) ? (
                <span className='friends-panel__status'>✅ Friend</span>
              ) : (
                <button
                  className='friends-panel__add-button'
                  onClick={() => handleAddFriend(user._id)}
                >
                  ➕ Add Friend
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <h3 className='friends-panel__heading'>Your Friends</h3>
      <ul className='friends-panel__list friends-panel__list--friends'>
        {friends.map(friend => (
          <li key={friend._id} className='friends-panel__item'>
            <img
              src={friend.profilePic}
              alt={`${friend.username}'s avatar`}
              className='friends-panel__avatar'
            />
            <span className='friends-panel__username'>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FriendsPanel
