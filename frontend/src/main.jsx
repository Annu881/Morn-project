// This file is the entry point for the frontend application
// It's imported by index.js

// Import React and ReactDOM
import React from "react"
import ReactDOM from "react-dom/client"

// Import the main App component
import App from "./App"

// Import the AuthProvider for authentication context
import { AuthProvider } from "./context/AuthContext.jsx"

// Import BrowserRouter for routing
import { BrowserRouter } from "react-router-dom"

// Import global styles
import "./index.css"

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById("root"))

// Render the application
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
