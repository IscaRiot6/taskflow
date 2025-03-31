import React, { useState, useEffect } from 'react'
import '../styles/Profile.css'

const Profile = ({ profile, setProfile }) => {
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [bio, setBio] = useState('')
  const [password, setPassword] = useState('')
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true
  })

  // ✅ Sync state when `profile` changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setEmail(profile.email || '')
      setProfilePic(profile.profilePic || '')
      setBio(profile.bio || '')
      setSettings(profile.settings || { darkMode: false, notifications: true })
      setMessage(
        `Welcome back, ${profile.username}! You can update your profile and settings here.`
      )
    }
  }, [profile]) // ⬅️ Updated dependency

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('authToken')

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/profile/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            username,
            email,
            profilePic,
            bio,
            settings,
            password
          })
        }
      )

      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || 'Failed to update profile')

      setProfile(data) // Update the profile in ProfilePage.js
      setShowForm(false) // Hide form after updating
    } catch (error) {
      console.error('❌ Error updating profile:', error)
    }
  }

  return (
    <div className='profile-container'>
      {/* Dynamic message for welcome */}
      <h2>{message}</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Edit Profile'}
      </button>

      {showForm && (
        <div className='profile-form'>
          {/* Editable sections */}
          <div>
            <strong>Username:</strong>
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <strong>Email:</strong>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <strong>Profile Picture URL:</strong>
            <input
              type='text'
              value={profilePic}
              onChange={e => setProfilePic(e.target.value)}
            />
          </div>

          <div>
            <strong>Bio:</strong>
            <textarea value={bio} onChange={e => setBio(e.target.value)} />
          </div>

          <div>
            <strong>Change Password:</strong>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Settings */}
          <div>
            <strong>Dark Mode:</strong>
            <input
              type='checkbox'
              checked={settings.darkMode}
              onChange={e =>
                setSettings({ ...settings, darkMode: e.target.checked })
              }
            />
          </div>

          <div>
            <strong>Notifications:</strong>
            <input
              type='checkbox'
              checked={settings.notifications}
              onChange={e =>
                setSettings({ ...settings, notifications: e.target.checked })
              }
            />
          </div>

          {/* Save changes button */}
          <button onClick={handleUpdateProfile}>Save Changes</button>
        </div>
      )}
    </div>
  )
}

export default Profile
