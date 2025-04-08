import React from 'react'

const FriendActions = ({
  user,
  isFriend,
  isSent,
  isReceived,
  handleSendRequest,
  handleAcceptRequest,
  handleRejectRequest,
  toggleMutualFriends,
  setModalUserId,
}) => {
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

export default FriendActions
