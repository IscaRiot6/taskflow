import { useState, useEffect } from 'react'

import '../styles/About.css'
// import { Typewriter } from 'react-simple-typewriter'
import FloatingTasks from './FloatingTasks'

const About = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(Math.floor(Math.random() * 100) + 1) // Generate random % each refresh
  }, [])

  return (
    <div className='about-container'>
      <FloatingTasks />
      <div className='about-header'>
        <h1 className='about-title'>About TaskFlow</h1>
        <p className='about-subtitle'>
          Discover what makes TaskFlow unique — where productivity meets
          creativity.
        </p>
      </div>
      <div className='productivity-bar'>
        <p>Your Productivity Level: {progress}%</p>
        <div className='progress-container'>
          <div className='progress-bar'></div>
        </div>
      </div>
      <div className='about-content'>
        <p className='typing-text'>
          `🌟 Welcome to TaskFlow 🌟 A productivity & creativity hub where task
          management meets anime flair, built to keep things organized,
          personal, and just a bit magical. TaskFlow isn't just another to-do
          app — it's a vibrant space for users to track, explore, and enhance
          their personal journeys. Inspired by the captivating world of anime
          and storytelling, the app allows users to create not only ordinary
          tasks but deep, thematic entries that feel more like storyboards than
          simple notes. ✨ What makes it special? 📝 Rich Task Creation Each
          task is more than a checkbox. Users can assign titles, genres, themes,
          personal scores, descriptions, and two custom images, transforming
          tasks into curated movie/anime entries. 🧩 Nested Tasks System
          Organize sub-tasks that live within a specific parent task — perfect
          for breaking down projects or building interconnected story arcs. Each
          nested task is accessible on its own page, just like the parent ones.
          🏠 Dual-View Navigation Seamlessly switch between the Home view (for
          main tasks) and dedicated Nested Task views. Both offer detailed
          insights and intuitive access. 🎨 Anime-Inspired UI & Carousels With
          anime-themed images, backgrounds, and random visual generators,
          TaskFlow creates a playful, immersive vibe that makes productivity a
          joy. ❤️ Favorites Section Bookmark your most-loved entries — whether
          that’s a dream project or your favorite anime/movie tasks — and
          revisit them anytime from a dedicated page. 🔍 Smooth Browsing
          Features like pagination, sorting, and live search help users glide
          through their tasks effortlessly. 👤 Personal Profiles Every user has
          a private profile with editable info, profile picture, and bio. (Still
          evolving!) Users can also find and add friends, or remove them as
          needed. 💌 Contact & About Pages Reach out directly via a built-in
          contact page or learn more about the app’s purpose and creator via the
          About section. 🔐 Auth Flow + Welcome Page A clean and welcoming auth
          experience with Sign Up, Login, and an introductory landing page that
          guides new users in. 🎥 Bonus: Store & Showcase Your Favorite Shows
          Think of TaskFlow as your personal anime/movie tracker, too! Log and
          rate what you love, build a curated favorites list, and even nest
          similar titles together. It's a hybrid productivity & fandom tool —
          your daily planner with a sprinkle of otaku. 🔜 Coming Soon… Real-Time
          Chat! Next on the roadmap? Adding Socket.IO-powered messaging so users
          can actually chat with friends inside the app. Whether it’s sharing
          task ideas or just saying hi, interaction is about to level up.`
        </p>
        <p>
          Built with React and Node.js, this app is simple, intuitive, and
          designed for quick usage.
        </p>
      </div>
      <div className='about-footer'>
        <p>&copy; 2025 My Todo App. All rights reserved.</p>
      </div>
    </div>
  )
}

export default About
