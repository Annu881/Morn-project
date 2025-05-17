const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
const Project = require("../models/Project")
const User = require("../models/User")
const Automation = require("../models/Automation")
const auth = require("../middleware/auth")

// Create a new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dueDate, status, projectId, assigneeId } = req.body

    // Check if project exists and user is a member
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members.some((member) => member.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to create tasks in this project" })
    }

    // Create task
    const task = new Task({
      title,
      description,
      dueDate,
      status: status || "To Do",
      project: projectId,
      assignee: assigneeId || null,
      creator: req.userId,
      badges: [],
    })

    await task.save()

    // Check for automations related to task creation
    await checkAndApplyAutomations(task)

    // Populate the task with assignee and creator details
    const populatedTask = await Task.findById(task._id)
        .populate("assignee", "name email badges")
        .populate("creator", "name email")

    res.status(201).json(populatedTask)
  } catch (error) {
    console.error("Task creation error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all tasks for a project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const { projectId } = req.params

    // Check if project exists and user is a member
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members.some((member) => member.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to view tasks in this project" })
    }

    // Get tasks
    const tasks = await Task.find({ project: projectId })
        .populate("assignee", "name email badges")
        .populate("creator", "name email")

    res.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, dueDate, status, assigneeId } = req.body

    // Find task
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if project exists and user is a member
    const project = await Project.findById(task.project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members.some((member) => member.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to update tasks in this project" })
    }

    // Save old values for automation checks
    const oldStatus = task.status
    const oldAssignee = task.assignee

    // Update task
    if (title) task.title = title
    if (description !== undefined) task.description = description
    if (dueDate !== undefined) task.dueDate = dueDate
    if (status) task.status = status
    if (assigneeId !== undefined) task.assignee = assigneeId || null

    await task.save()

    // Check for automations
    if (status && status !== oldStatus) {
      await checkStatusChangeAutomations(task, oldStatus)
    }

    if (assigneeId !== undefined && assigneeId !== oldAssignee?.toString()) {
      await checkAssigneeChangeAutomations(task, oldAssignee)
    }

    // Check for due date passed automations
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      await checkDueDatePassedAutomations(task)
    }

    // Populate the task with assignee and creator details
    const updatedTask = await Task.findById(task._id)
        .populate("assignee", "name email badges")
        .populate("creator", "name email")

    res.json(updatedTask)
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find task
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if project exists and user is a member
    const project = await Project.findById(task.project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members.some((member) => member.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to delete tasks in this project" })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add badge to task
router.post("/:id/badge", auth, async (req, res) => {
  try {
    const { badgeName } = req.body

    // Find task
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if project exists and user is a member
    const project = await Project.findById(task.project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members.some((member) => member.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to add badges to this task" })
    }

    // Add badge to task
    task.badges.push({
      name: badgeName,
      awardedAt: new Date(),
    })

    await task.save()

    // If task has an assignee, add badge to user as well
    if (task.assignee) {
      const user = await User.findById(task.assignee)
      if (user) {
        user.badges.push({
          name: badgeName,
          project: task.project,
          awardedAt: new Date(),
        })
        await user.save()
      }
    }

    // Populate the task with assignee and creator details
    const updatedTask = await Task.findById(task._id)
        .populate("assignee", "name email badges")
        .populate("creator", "name email")

    res.json(updatedTask)
  } catch (error) {
    console.error("Add badge error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Helper functions for automations
async function checkAndApplyAutomations(task) {
  // Check for automations related to task creation
  try {
    const automations = await Automation.find({
      project: task.project,
    })

    for (const automation of automations) {
      // Apply automation based on trigger type
      if (automation.trigger.type === "status_change" && automation.trigger.condition.status === task.status) {
        await applyAutomationAction(task, automation.action)
      } else if (
          automation.trigger.type === "assignee_change" &&
          task.assignee &&
          automation.trigger.condition.userId === task.assignee.toString()
      ) {
        await applyAutomationAction(task, automation.action)
      } else if (automation.trigger.type === "due_date_passed" && task.dueDate && new Date(task.dueDate) < new Date()) {
        await applyAutomationAction(task, automation.action)
      }
    }
  } catch (error) {
    console.error("Error checking automations:", error)
  }
}

async function checkStatusChangeAutomations(task, oldStatus) {
  try {
    // Find automations for this project with status_change trigger
    const automations = await Automation.find({
      project: task.project,
      "trigger.type": "status_change",
      "trigger.condition.status": task.status,
    })

    for (const automation of automations) {
      await applyAutomationAction(task, automation.action)
    }
  } catch (error) {
    console.error("Error applying status change automations:", error)
  }
}

async function checkAssigneeChangeAutomations(task, oldAssignee) {
  try {
    // Find automations for this project with assignee_change trigger
    const automations = await Automation.find({
      project: task.project,
      "trigger.type": "assignee_change",
    })

    for (const automation of automations) {
      // Check if the condition matches
      if (
          automation.trigger.condition.userId &&
          task.assignee &&
          automation.trigger.condition.userId.toString() === task.assignee.toString()
      ) {
        await applyAutomationAction(task, automation.action)
      }
    }
  } catch (error) {
    console.error("Error applying assignee change automations:", error)
  }
}

async function checkDueDatePassedAutomations(task) {
  try {
    // Find automations for this project with due_date_passed trigger
    const automations = await Automation.find({
      project: task.project,
      "trigger.type": "due_date_passed",
    })

    for (const automation of automations) {
      await applyAutomationAction(task, automation.action)
    }
  } catch (error) {
    console.error("Error applying due date passed automations:", error)
  }
}

async function applyAutomationAction(task, action) {
  try {
    if (action.type === "change_status") {
      task.status = action.value.status
      await task.save()
    } else if (action.type === "assign_user") {
      task.assignee = action.value.userId
      await task.save()
    } else if (action.type === "add_badge") {
      // Add badge to task
      const badgeExists = task.badges.some((badge) => badge.name === action.value.badge)
      if (!badgeExists) {
        task.badges.push({
          name: action.value.badge,
          awardedAt: new Date(),
        })
        await task.save()
      }

      // Add badge to user if task is assigned
      if (task.assignee) {
        const user = await User.findById(task.assignee)
        if (user) {
          const userBadgeExists = user.badges.some(
              (badge) => badge.name === action.value.badge && badge.project.toString() === task.project.toString(),
          )
          if (!userBadgeExists) {
            user.badges.push({
              name: action.value.badge,
              project: task.project,
              awardedAt: new Date(),
            })
            await user.save()
          }
        }
      }
    }
  } catch (error) {
    console.error("Error applying automation action:", error)
  }
}

module.exports = router
