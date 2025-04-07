import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './components/App'
import './index.css'
import { ThemeProvider } from './components/ThemeContext'

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        {' '}
        {/* Theming logic is handled here */}
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
)
