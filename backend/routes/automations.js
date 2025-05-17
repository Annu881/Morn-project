const express = require("express")
const router = express.Router()
const Automation = require("../models/Automation")
const Project = require("../models/Project")
const auth = require("../middleware/auth")

// Create a new automation
router.post("/", auth, async (req, res) => {
  try {
    const { projectId, trigger, action } = req.body

    // Check if project exists and user is the owner
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (project.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Only project owner can create automations" })
    }

    // Create automation
    const automation = new Automation({
      project: projectId,
      trigger,
      action,
    })

    await automation.save()

    res.status(201).json(automation)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all automations for a project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const { projectId } = req.params

    // Check if project exists and user is a member
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members.includes(req.userId)) {
      return res.status(403).json({ message: "Not authorized to view automations in this project" })
    }

    // Get automations
    const automations = await Automation.find({ project: projectId })

    res.json(automations)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update automation
router.put("/:id", auth, async (req, res) => {
  try {
    const { trigger, action } = req.body

    // Find automation
    const automation = await Automation.findById(req.params.id)

    if (!automation) {
      return res.status(404).json({ message: "Automation not found" })
    }

    // Check if project exists and user is the owner
    const project = await Project.findById(automation.project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (project.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Only project owner can update automations" })
    }

    // Update automation
    if (trigger) automation.trigger = trigger
    if (action) automation.action = action

    await automation.save()

    res.json(automation)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete automation
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find automation
    const automation = await Automation.findById(req.params.id)

    if (!automation) {
      return res.status(404).json({ message: "Automation not found" })
    }

    // Check if project exists and user is the owner
    const project = await Project.findById(automation.project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (project.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Only project owner can delete automations" })
    }

    await Automation.findByIdAndDelete(req.params.id)

    res.json({ message: "Automation deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
