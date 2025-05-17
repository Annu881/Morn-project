"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext.jsx"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })
  const [error, setError] = useState("")
  const { register } = useAuth()
  const navigate = useNavigate()

  const { name, email, password, password2 } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== password2) {
      setError("Passwords do not match")
      return
    }

    const result = await register({
      name,
      email,
      password,
    })

    if (result === true) {
      navigate("/")
    } else {
      setError(result.error)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Register</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={onChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
  },
}

export default Register
