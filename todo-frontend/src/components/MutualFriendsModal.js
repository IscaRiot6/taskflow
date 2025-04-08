import React, { useEffect, useState } from 'react'
import '../styles/MutualFriendsModal.css'

const MutualFriendsModal = ({ open, onClose, userId }) => {
  const [mutuals, setMutuals] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMutuals = async () => {
      if (!userId || !open) return

      setLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/friends/mutual/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const data = await res.json()
        setMutuals(data)
      } catch (err) {
        console.error('Error fetching mutual friends', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMutuals()
  }, [userId, open])

  if (!open) return null

  return (
    <div className='modal-backdrop'>
      <div className='modal'>
        <button className='modal__close' onClick={onClose}>
          ✖
        </button>
        <h3>Mutual Friends</h3>

        {loading ? (
          <p>Loading...</p>
        ) : mutuals.length === 0 ? (
          <p>No mutuals yet.</p>
        ) : (
          <ul className='modal__mutuals-list'>
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
        )}
      </div>
    </div>
  )
}

export default MutualFriendsModal
