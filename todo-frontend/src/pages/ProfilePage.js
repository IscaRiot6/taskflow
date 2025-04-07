import React, { useState, useEffect } from 'react'
import Profile from '../components/Profile' // Keeps the form
import ProfileInfo from '../components/ProfileInfo' // Displays saved info
import FriendsPanel from '../components/FriendsPanel'

const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('No authentication token found.')
        return
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/profile`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) throw new Error('Failed to fetch profile')

        const data = await response.json()

        setProfile(data)
      } catch (error) {
        setError(error.message)
      }
    }

    fetchUserProfile()
  }, [])

  if (!profile) {
    return <div>Loading...</div> // Show loading state while user data is being fetched
  }

  return (
    <div className='profile-page'>
      <h1 className='profile-title'>Profile Page</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className='profile-content'>
        <ProfileInfo profile={profile} />
        <Profile profile={profile} setProfile={setProfile} />
      </div>
      <div>
        <FriendsPanel />
      </div>
    </div>
  )
}

export default ProfilePage
