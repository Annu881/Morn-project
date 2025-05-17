"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import BadgesList from "./badges/BadgesList"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [showBadges, setShowBadges] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleBadges = () => {
    setShowBadges(!showBadges)
  }

  return (
      <nav style={styles.navbar}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            TaskBoard Pro
          </Link>
          <div style={styles.rightSection}>
            {isAuthenticated ? (
                <>
                  <div style={styles.userSection}>
                    <span style={styles.username}>Hello, {user?.name}</span>
                    {user?.badges && user.badges.length > 0 && (
                        <button onClick={toggleBadges} style={styles.badgesButton}>
                          Badges ({user.badges.length})
                        </button>
                    )}
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                      Logout
                    </button>
                  </div>
                  {showBadges && user?.badges && user.badges.length > 0 && (
                      <div style={styles.badgesDropdown}>
                        <h4 style={styles.badgesTitle}>Your Badges</h4>
                        <div style={styles.badgesList}>
                          {user.badges.map((badge, index) => (
                              <div key={`user-badge-${index}`} style={styles.badgeItem}>
                                <div style={styles.badgeName}>
                                  <BadgesList badges={[badge]} size="medium" />
                                </div>
                                <div style={styles.badgeProject}>
                                  {badge.project ? `Project: ${badge.project.title || "Unknown"}` : ""}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </>
            ) : (
                <>
                  <Link to="/login" style={styles.navLink}>
                    Login
                  </Link>
                  <Link to="/register" style={styles.navLink}>
                    Register
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 0",
    position: "relative",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  rightSection: {
    position: "relative",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "20px",
  },
  username: {
    marginRight: "20px",
  },
  badgesButton: {
    backgroundColor: "#4a6ee0",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    marginRight: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
  badgesDropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    zIndex: "100",
    minWidth: "250px",
    marginTop: "10px",
  },
  badgesTitle: {
    margin: "0 0 10px 0",
    color: "#333",
    borderBottom: "1px solid #eee",
    paddingBottom: "5px",
  },
  badgesList: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  badgeItem: {
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  badgeName: {
    marginBottom: "4px",
  },
  badgeProject: {
    fontSize: "12px",
    color: "#666",
  },
}

export default Navbar
