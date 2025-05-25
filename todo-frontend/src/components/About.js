import { useEffect, useState } from 'react'
import '../styles/About.css'
import FloatingTasks from './FloatingTasks'
import {
  Sparkles,
  Puzzle,
  MessageCircle,
  ShieldCheck,
  Film,
  Users
} from 'lucide-react'

const About = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(Math.floor(Math.random() * 100) + 1)
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

      <div className='productivity-bar always-on'>
        <p>Your Productivity Level: {progress}%</p>
        <div className='progress-container'>
          <div className='progress-bar' style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className='about-content'>
        <p className='icon-paragraph'>
          <span className='icon-wrapper'>
            <Sparkles size={18} />
          </span>
          <strong>Concept:</strong> Welcome to TaskFlow — a productivity and
          creativity hub that blends task management with anime-inspired
          storytelling. From thematic tasks to nested arcs, TaskFlow lets you
          plan your day like you're building a story.
        </p>

        <p className='icon-paragraph'>
          <span className='icon-wrapper'>
            <Puzzle size={18} />
          </span>
          <strong>Features:</strong> Deep task creation with custom
          themes/images, nested tasks, dual navigation views, favorites,
          profiles, live search, and sorting — all wrapped in a playful
          anime-themed UI.
        </p>

        <p className='icon-paragraph'>
          <span className='icon-wrapper'>
            <MessageCircle size={18} />
          </span>
          <strong>Live Chat System:</strong> Add friends and chat in real-time
          with timestamps, visibility toggles, and message alerts. UX updates
          are coming soon!
        </p>

        <p className='icon-paragraph'>
          <span className='icon-wrapper'>
            <Users size={18} />
          </span>
          <strong>Forum Section:</strong> Share posts on tasks, anime, or life.
          Supports votes, replies (with nesting), and pagination. Admin
          moderation is planned.
        </p>

        <p className='icon-paragraph'>
          <span className='icon-wrapper'>
            <ShieldCheck size={18} />
          </span>
          <strong>Authentication:</strong> Smooth sign-up/login experience with
          an inviting landing page.
        </p>

        <p className='icon-paragraph'>
          <span className='icon-wrapper'>
            <Film size={18} />
          </span>
          <strong>Bonus Tracker:</strong> Track and rate anime or movies — use
          TaskFlow as both planner and fandom log.
        </p>

        <p>
          <strong>Stack:</strong> Built with React and Node.js — lightweight,
          fast, and optimized for creative productivity.
        </p>
      </div>

      <div className='about-footer'>
        <p>&copy; 2025 TaskFlow App. All rights reserved.</p>
      </div>
    </div>
  )
}

export default About
