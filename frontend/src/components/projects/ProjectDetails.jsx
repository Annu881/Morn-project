"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import TaskList from "../tasks/TaskList"
import TaskForm from "../tasks/TaskForm"
import InviteForm from "./InviteForm"
import AutomationList from "../automations/AutomationList"
import AutomationForm from "../automations/AutomationForm"
import BadgesList from "../badges/BadgesList"
import { useAuth } from "../../context/AuthContext"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [showAutomationForm, setShowAutomationForm] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const projectRes = await axios.get(`/projects/${id}`)
        setProject(projectRes.data)

        // Fetch tasks
        const tasksRes = await axios.get(`/tasks/project/${id}`)
        setTasks(tasksRes.data)

        // Fetch automations
        const automationsRes = await axios.get(`/automations/project/${id}`)
        setAutomations(automationsRes.data)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("Error fetching project data: " + (err.response?.data?.message || err.message))
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [id])

  const handleTaskCreate = async (taskData) => {
    try {
      const res = await axios.post("/tasks", {
        ...taskData,
        projectId: id,
      })
      setTasks([...tasks, res.data])
      setShowTaskForm(false)
    } catch (err) {
      console.error("Error creating task:", err)
      setError("Error creating task: " + (err.response?.data?.message || err.message))
    }
  }

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const res = await axios.put(`/tasks/${taskId}`, updatedData)
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)))
    } catch (err) {
      setError("Error updating task: " + (err.response?.data?.message || err.message))
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (err) {
      setError("Error deleting task: " + (err.response?.data?.message || err.message))
    }
  }

  const handleInviteUser = async (email) => {
    try {
      const res = await axios.post(`/projects/${id}/invite`, { email })
      setProject(res.data)
      setShowInviteForm(false)
    } catch (err) {
      setError(err.response?.data?.message || "Error inviting user")
    }
  }

  const handleAutomationCreate = async (automationData) => {
    try {
      const res = await axios.post("/automations", {
        ...automationData,
        projectId: id,
      })
      setAutomations([...automations, res.data])
      setShowAutomationForm(false)
    } catch (err) {
      setError("Error creating automation: " + (err.response?.data?.message || err.message))
    }
  }

  const handleAutomationDelete = async (automationId) => {
    try {
      await axios.delete(`/automations/${automationId}`)
      setAutomations(automations.filter((automation) => automation._id !== automationId))
    } catch (err) {
      setError("Error deleting automation: " + (err.response?.data?.message || err.message))
    }
  }

  // Get member badges for this project
  const getMemberBadges = (member) => {
    if (!member || !member.badges) return []
    return member.badges.filter((badge) => badge.project && badge.project.toString() === id)
  }

  if (loading) {
    return <div>Loading project...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const isOwner = user && project.owner && user.id === project.owner._id

  return (
      <div>
        <div style={styles.header}>
          <h1>{project.title}</h1>
          <div style={styles.actions}>
            <button onClick={() => navigate("/")} style={styles.backButton}>
              Back to Projects
            </button>
            {isOwner && (
                <button onClick={() => setShowInviteForm(!showInviteForm)} style={styles.inviteButton}>
                  Invite User
                </button>
            )}
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <p style={{ ...styles.description, color: 'black' }}>
           {project.description || "No description"}
</p>


        <div style={styles.tabs}>
          <button onClick={() => setActiveTab("tasks")} style={activeTab === "tasks" ? styles.activeTab : styles.tab}>
            Tasks
          </button>
          <button
              onClick={() => setActiveTab("automations")}
              style={activeTab === "automations" ? styles.activeTab : styles.tab}
          >
            Automations
          </button>
          <button onClick={() => setActiveTab("members")} style={activeTab === "members" ? styles.activeTab : styles.tab}>
            Members
          </button>
        </div>

        {activeTab === "tasks" && (
            <div>
              <div style={styles.taskHeader}>
                <h2>Tasks</h2>
                <button onClick={() => setShowTaskForm(!showTaskForm)} style={styles.addButton}>
                  Add Task
                </button>
              </div>

              {showTaskForm && (
                  <TaskForm onSubmit={handleTaskCreate} onCancel={() => setShowTaskForm(false)} project={project} />
              )}

              <TaskList
                  tasks={tasks}
                  statuses={project.statuses}
                  onStatusChange={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                  members={project.members}
              />
            </div>
        )}

        {activeTab === "automations" && (
            <div>
              <div style={styles.taskHeader}>
                <h2>Automations</h2>
                {isOwner && (
                    <button onClick={() => setShowAutomationForm(!showAutomationForm)} style={styles.addButton}>
                      Add Automation
                    </button>
                )}
              </div>

              {showAutomationForm && (
                  <AutomationForm
                      onSubmit={handleAutomationCreate}
                      onCancel={() => setShowAutomationForm(false)}
                      project={project}
                  />
              )}

              <AutomationList automations={automations} onDelete={handleAutomationDelete} isOwner={isOwner} />
            </div>
        )}

        {activeTab === "members" && (
            <div>
              <h2>Project Members</h2>
              <div style={styles.membersList}>
                {project.members &&
                    project.members.map((member) => (
                        <div key={member._id || member} style={styles.memberCard}>
                          <div style={styles.memberName}>{member.name || "Loading..."}</div>
                          <div style={styles.memberEmail}>{member.email || "Loading..."}</div>

                          {member.badges && member.badges.length > 0 && (
                              <div style={styles.memberBadges}>
                                <BadgesList badges={getMemberBadges(member)} />
                              </div>
                          )}

                          {project.owner && member._id === project.owner._id && <div style={styles.ownerBadge}>Owner</div>}
                        </div>
                    ))}
              </div>
            </div>
        )}

        {showInviteForm && <InviteForm onSubmit={handleInviteUser} onCancel={() => setShowInviteForm(false)} />}
      </div>
  )
}
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "12px",
    borderBottom: "1px solid #ddd",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  backButton: {
    padding: "10px 18px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  inviteButton: {
    padding: "10px 18px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  description: {
    marginBottom: "20px",
    color: "#666",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  error: {
    color: "#d32f2f",
    backgroundColor: "#fff0f0",
    border: "1px solid #ffcaca",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },tabs: {
  display: "flex",
  borderBottom: "2px solid #eee",
  marginBottom: "20px",
},
tab: {
  padding: "10px 16px",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#000", // Inactive tab color is black
  fontSize: "14px",
  fontWeight: "500",
},
activeTab: {
  padding: "10px 16px",
  backgroundColor: "transparent",
  borderBottom: "2px solid #000", // underline in black
  color: "#000", // Active tab text is black too
  fontWeight: "600",
},


  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  addButton: {
    padding: "10px 18px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  membersList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  memberCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    position: "relative",
  },
  memberName: {
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "4px",
    color: "#333",
  },
  memberEmail: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "10px",
  },
  memberBadges: {
    marginTop: "10px",
  },
  ownerBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
};


export default ProjectDetails
