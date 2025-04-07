import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default') // fallback theme

  // Optional: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved)
  }, [])

  const updateTheme = newTheme => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      <div className={`app theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  )
}
