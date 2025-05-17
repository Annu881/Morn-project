"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Set up axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token)
        try {
          const res = await axios.get("/auth/me")
          setUser(res.data.user)
          setIsAuthenticated(true)
        } catch (err) {
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post("/auth/register", formData)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      return true
    } catch (err) {
      return { error: err.response.data.message || "Registration failed" }
    }
  }

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post("/auth/login", formData)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      return true
    } catch (err) {
      return { error: err.response.data.message || "Login failed" }
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
      <AuthContext.Provider
          value={{
            token,
            isAuthenticated,
            loading,
            user,
            register,
            login,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}
