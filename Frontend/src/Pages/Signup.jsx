import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import LoginButton from '../Components/LoginButton'
import ThemeToggle from '../Components/ThemeToggle'

export default function Signup() {
  const { signup, authError, authLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await signup(name, email, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="center-screen">
      <ThemeToggle fixed />
      <form onSubmit={handleSubmit} className="card" style={{ padding: 32, width: 360 }}>
        <h2 style={{ marginTop: 0 }}>Create account</h2>

        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        {authError && <div className="error-text">{authError}</div>}

        <div style={{ marginTop: 18 }}>
          <LoginButton loading={authLoading}>Sign up</LoginButton>
        </div>

        <p style={{ textAlign: 'center', marginBottom: 0, color: 'var(--text-dim)', fontSize: 14 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}
