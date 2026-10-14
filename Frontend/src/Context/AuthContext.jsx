import { createContext, useContext, useState, useCallback } from 'react'
import * as api from '../Services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem('token', nextToken)
    localStorage.setItem('user', JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const login = useCallback(async (email, password) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const { data } = await api.login(email, password)
      persistSession(data.token, data.user)
      return true
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid email or password.')
      return false
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const signup = useCallback(async (name, email, password) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const { data } = await api.signup(name, email, password)
      persistSession(data.token, data.user)
      return true
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Could not create account.')
      return false
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    authError,
    authLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
