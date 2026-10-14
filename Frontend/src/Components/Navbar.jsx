import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>CRUD</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {user?.name && <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{user.name}</span>}
        <ThemeToggle />
        <button className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  )
}
