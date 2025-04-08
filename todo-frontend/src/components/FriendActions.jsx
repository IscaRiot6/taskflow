import React from 'react'

const FriendItem = ({
  user,
  isFriend,
  isSent,
  isReceived,
  handleSendRequest,
  handleAcceptRequest,
  handleRejectRequest,
  toggleMutualFriends,
  setModalUserId
}) => {
  const id = user._id

  const renderUserActions = () => {
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
    <li className='friends-panel__item'>
      <img
        src={user.profilePic || null}
        alt=''
        className='friends-panel__avatar'
        onError={e => {
          e.target.onerror = null
          e.target.src = '/default-avatar.png'
        }}
      />
      <a
        href={`/profile/${user._id}`}
        className='friends-panel__username-link'
      >
        {user.username} 🔗
      </a>
      {renderUserActions()}
    </li>
  )
}

export default FriendItem
