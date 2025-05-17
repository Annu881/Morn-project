const express = require("express")
const router = express.Router()
const Project = require("../models/Project")
const User = require("../models/User")
const auth = require("../middleware/auth")

// Create a new project
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body

    const project = new Project({
      title,
      description,
      owner: req.userId,
      members: [req.userId],
    })

    await project.save()

    // Populate owner details
    const populatedProject = await Project.findById(project._id)
        .populate("owner", "name email")
        .populate("members", "name email")

    res.status(201).json(populatedProject)
  } catch (error) {
    console.error("Create project error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all projects for current user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.userId,
    }).populate("owner", "name email")

    res.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get project by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
        .populate("owner", "name email")
        .populate("members", "name email")

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is a member of the project
    if (!project.members.some((member) => member._id.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to access this project" })
    }

    res.json(project)
  } catch (error) {
    console.error("Get project error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, statuses } = req.body

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is the owner of the project
    if (project.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this project" })
    }

    if (title) project.title = title
    if (description !== undefined) project.description = description
    if (statuses) project.statuses = statuses

    await project.save()

    // Return populated project
    const updatedProject = await Project.findById(project._id)
        .populate("owner", "name email")
        .populate("members", "name email")

    res.json(updatedProject)
  } catch (error) {
    console.error("Update project error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Invite user to project
router.post("/:id/invite", auth, async (req, res) => {
  try {
    const { email } = req.body

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is the owner of the project
    if (project.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized to invite users to this project" })
    }

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if user is already a member
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User is already a member of this project" })
    }

    // Add user to project members
    project.members.push(user._id)
    await project.save()

    // Return populated project
    const updatedProject = await Project.findById(project._id)
        .populate("owner", "name email")
        .populate("members", "name email")

    res.json(updatedProject)
  } catch (error) {
    console.error("Invite user error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is the owner of the project
    if (project.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this project" })
    }

    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
