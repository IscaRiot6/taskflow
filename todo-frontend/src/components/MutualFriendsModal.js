import React from 'react'
import '../styles/MutualFriendsModal.css' // optional new file

const MutualFriendsModal = ({ open, onClose, mutuals = [] }) => {
  if (!open) return null

  return (
    <div className='modal-backdrop'>
      <div className='modal'>
        <button className='modal__close' onClick={onClose}>
          ✖
        </button>
        <h3>Mutual Friends</h3>
        <ul className='modal__mutuals-list'>
          {mutuals.length === 0 && <p>No mutuals yet.</p>}
          {mutuals.map(mutual => (
            <li key={mutual._id} className='modal__mutual-item'>
              <img
                src={mutual.profilePic || '/default-avatar.png'}
                alt={mutual.username}
                className='modal__avatar'
              />
              <span>{mutual.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MutualFriendsModal
