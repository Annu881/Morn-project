const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const user = new User({ name, email, password, badges: [] })
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        badges: user.badges,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        badges: user.badges,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "badges.project",
      select: "title",
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        badges: user.badges,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user badges
router.get("/badges", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "badges.project",
      select: "title",
    })

    res.json({
      badges: user.badges,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
