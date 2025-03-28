import React, { useRef, useState } from 'react'
import '../styles/MiniAudioPlayer.css'

const MiniAudioPlayer = () => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const songUrl =
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className='mini-audio-player'>
      <audio ref={audioRef} src={songUrl}></audio>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  )
}

export default MiniAudioPlayer
