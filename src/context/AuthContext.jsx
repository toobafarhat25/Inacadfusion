import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // Optional: check user token on mount/load
  useEffect(() => {
    const checkUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await api.get('/auth/me')
          setUser(res.data.data)
          localStorage.setItem('user', JSON.stringify(res.data.data))
        } catch (err) {
          logout()
        }
      }
    }
    checkUser()
  }, [])

  const login = async (email, password, role) => {
    try {
      const res = await api.post('/auth/login', { email, password, role })
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      throw new Error(message)
    }
  }

  const registerUser = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData)
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      throw new Error(message)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
