import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (token && userData) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(JSON.parse(userData))
      }

      setLoading(false)
    }

    loadUserFromStorage()
  }, [])

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/token/', {
        username,
        password,
      })

      const { access, refresh } = response.data

      localStorage.setItem('token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify({ username }))

      api.defaults.headers.common['Authorization'] = `Bearer ${access}`
      setUser({ username })

      toast.success('Login realizado com sucesso!')
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Usuário ou senha incorretos')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    toast.info('Logout realizado')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext