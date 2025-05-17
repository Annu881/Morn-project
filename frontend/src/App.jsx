"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext.jsx"
import  "./App.css"
// Components
import Navbar from "./components/Navbar.jsx"
import Login from "./components/auth/Login.jsx"
import Register from "./components/auth/Register.jsx"
import Dashboard from "./components/Dashboard.jsx"
import ProjectDetails from "./components/projects/ProjectDetails.jsx"
import CreateProject from "./components/projects/CreateProject.jsx"

function App() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/projects/new" element={isAuthenticated ? <CreateProject /> : <Navigate to="/login" />} />
                    <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </>
    )
}

export default App
