const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const projectRoutes = require("./routes/projects")
const taskRoutes = require("./routes/tasks")
const automationRoutes = require("./routes/automations")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/automations", automationRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
