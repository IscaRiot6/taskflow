import React, { useEffect, useState } from 'react'
import '../styles/Profile.css'
import '../styles/ProfileInfo.css'

const ProfileInfo = ({ profile }) => {
  const [taskCount, setTaskCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [historyLog, setHistoryLog] = useState([]) // Keep historyLog state

  useEffect(() => {
    const fetchTaskCounts = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) return

      try {
        // Fetch saved tasks count
        const taskRes = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/tasks`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        if (taskRes.ok) {
          const taskData = await taskRes.json()
          setTaskCount(taskData.count)
        }

        // Fetch favorite tasks count
        const favRes = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/favorites`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        if (favRes.ok) {
          const favData = await favRes.json()
          setFavoriteCount(favData.count)
        }

        // Fetch history log
        const historyRes = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/history`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        if (historyRes.ok) {
          const historyData = await historyRes.json()
          setHistoryLog(historyData) // Assuming backend returns an array of log entries
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchTaskCounts()
  }, []) // No changes to dependency array

  if (!profile) return <p>Loading profile...</p>

  return (
    <div className='profile-info'>
      <div className='profile-header'>
        <a href={`/profile/${profile.username}`} className='profile-username'>
          <h2>{profile.username}</h2>
        </a>
        <img
          src={profile.profilePic}
          alt='Profile'
          width='100'
          height='100'
          className='profile-pic'
        />
      </div>

      <p className='profile-email'>{profile.email}</p>
      <p className='profile-bio'>{profile.bio}</p>

      <div className='profile-tasks'>
        <p>
          <strong>Saved Tasks:</strong> <span>{taskCount}</span>
        </p>
        <p>
          <strong>Favorite Tasks:</strong> <span>{favoriteCount}</span>
        </p>
      </div>

      <div className='profile-settings'>
        <p>
          <strong>Dark Mode:</strong> {profile.settings.darkMode ? 'On' : 'Off'}
        </p>
        <p>
          <strong>Notifications:</strong>{' '}
          {profile.settings.notifications ? 'Enabled' : 'Disabled'}
        </p>
      </div>

      {/* Fixed History Log */}
      <div className='profile-history'>
        <h3>History Log</h3>
        {historyLog.length > 0 ? (
          <ul>
            {historyLog.map((entry, index) => (
              <li key={entry._id || index}>
                <strong>{entry.action}</strong> (Task ID: {entry.taskId}) -{' '}
                {new Date(entry.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No history available</p>
        )}
      </div>
    </div>
  )
}

export default ProfileInfo
