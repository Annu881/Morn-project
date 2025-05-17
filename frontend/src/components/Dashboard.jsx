"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hoveredCard, setHoveredCard] = useState(null) // 👈 Hover state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/projects")
        setProjects(res.data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching projects")
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div>
      <div style={styles.header}>
        <h1>My Projects</h1>
        <Link to="/projects/new" style={styles.createButton}>
          Create Project
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {projects.length === 0 ? (
        <div style={styles.noProjects}>
          <p>You don't have any projects yet.</p>
          <Link to="/projects/new" style={styles.linkButton}>
            Create your first project
          </Link>
        </div>
      ) : (
        <div style={styles.projectGrid}>
          {projects.map((project) => {
            const isHovered = hoveredCard === project._id
            const cardStyle = {
              ...styles.projectCard,
              transform: isHovered ? "scale(1.03)" : "scale(1)",
              boxShadow: isHovered
                ? "0 10px 24px rgba(0, 0, 0, 0.15)"
                : styles.projectCard.boxShadow,
              cursor: "pointer",
            }

            return (
              <div
                key={project._id}
                style={cardStyle}
                onMouseEnter={() => setHoveredCard(project._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <p style={styles.projectDescription}>
                  {project.description || "No description"}
                </p>
                <div style={styles.projectMeta}>
                  <span>Members: {project.members.length}</span>
                </div>
                <Link to={`/projects/${project._id}`} style={styles.viewButton}>
                  View Project
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  createButton: {
    padding: "10px 18px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(74, 110, 224, 0.4)",
  },
  error: {
    color: "#b00020",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  noProjects: {
    textAlign: "center",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: "#1a1a1a",
  },
  linkButton: {
    display: "inline-block",
    marginTop: "12px",
    padding: "10px 18px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 12px rgba(74, 110, 224, 0.3)",
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  projectCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "10px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "#1a1a1a",
  },
  projectTitle: {
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  projectDescription: {
    color: "#2d2d2d",
    marginBottom: "16px",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  projectMeta: {
    fontSize: "13px",
    color: "#3a3a3a",
    marginBottom: "16px",
  },
  viewButton: {
    display: "inline-block",
    padding: "8px 14px",
    backgroundColor: "#e2e8f0",
    color: "#1f2937",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
}

export default Dashboard
