import React from 'react'
import ReactDOM from 'react-dom/client' // Update this import
import { BrowserRouter as Router } from 'react-router-dom'
import App from './components/App' // Adjust the import if needed
import './index.css' // Include your CSS file if you have one

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
