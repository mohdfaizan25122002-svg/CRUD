import { useState } from 'react'

const readTheme = () => {
  const theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme
  return theme
}

export default function ThemeToggle({ fixed = false }) {
  const [theme, setTheme] = useState(readTheme)

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  return (
    <button
      className={`btn btn-ghost theme-toggle${fixed ? ' theme-toggle-fixed' : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'white' : 'black'} theme`}
    >
      {theme === 'dark' ? '☀️ White theme' : '🌙 Black theme'}
    </button>
  )
}
