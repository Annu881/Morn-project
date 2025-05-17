"use client"

import { useState } from "react"

const AutomationForm = ({ onSubmit, onCancel, project }) => {
  const [formData, setFormData] = useState({
    triggerType: "status_change",
    triggerCondition: {
      status: project.statuses[0],
    },
    actionType: "change_status",
    actionValue: {
      status: project.statuses[0],
    },
  })
  const [error, setError] = useState("")

  const handleTriggerTypeChange = (e) => {
    const triggerType = e.target.value
    let triggerCondition = {}

    if (triggerType === "status_change") {
      triggerCondition = { status: project.statuses[0] }
    } else if (triggerType === "assignee_change") {
      triggerCondition = { userId: project.members[0]?._id || "" }
    } else if (triggerType === "due_date_passed") {
      triggerCondition = {}
    }

    setFormData({
      ...formData,
      triggerType,
      triggerCondition,
    })
  }

  const handleTriggerConditionChange = (e) => {
    setFormData({
      ...formData,
      triggerCondition: {
        ...formData.triggerCondition,
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleActionTypeChange = (e) => {
    const actionType = e.target.value
    let actionValue = {}

    if (actionType === "change_status") {
      actionValue = { status: project.statuses[0] }
    } else if (actionType === "assign_user") {
      actionValue = { userId: project.members[0]?._id || "" }
    } else if (actionType === "add_badge") {
      actionValue = { badge: "Completed" }
    }

    setFormData({
      ...formData,
      actionType,
      actionValue,
    })
  }

  const handleActionValueChange = (e) => {
    setFormData({
      ...formData,
      actionValue: {
        ...formData.actionValue,
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    const { triggerType, triggerCondition, actionType, actionValue } = formData

    onSubmit({
      trigger: {
        type: triggerType,
        condition: triggerCondition,
      },
      action: {
        type: actionType,
        value: actionValue,
      },
    })
  }

  return (
      <div style={styles.formContainer}>
        <h3>Create Automation</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h4>When this happens (Trigger):</h4>
            <div style={styles.formGroup}>
              <label htmlFor="triggerType">Trigger Type</label>
              <select
                  id="triggerType"
                  value={formData.triggerType}
                  onChange={handleTriggerTypeChange}
                  style={styles.select}
              >
                <option value="status_change">Task status changes</option>
                <option value="assignee_change">Task is assigned to someone</option>
                <option value="due_date_passed">Task due date passes</option>
              </select>
            </div>

            {formData.triggerType === "status_change" && (
                <div style={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                      id="status"
                      name="status"
                      value={formData.triggerCondition.status}
                      onChange={handleTriggerConditionChange}
                      style={styles.select}
                  >
                    {project.statuses.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                    ))}
                  </select>
                </div>
            )}

            {formData.triggerType === "assignee_change" && (
                <div style={styles.formGroup}>
                  <label htmlFor="userId">Assigned To</label>
                  <select
                      id="userId"
                      name="userId"
                      value={formData.triggerCondition.userId}
                      onChange={handleTriggerConditionChange}
                      style={styles.select}
                  >
                    {project.members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                    ))}
                  </select>
                </div>
            )}
          </div>

          <div style={styles.section}>
            <h4>Do this (Action):</h4>
            <div style={styles.formGroup}>
              <label htmlFor="actionType">Action Type</label>
              <select id="actionType" value={formData.actionType} onChange={handleActionTypeChange} style={styles.select}>
                <option value="change_status">Change task status</option>
                <option value="assign_user">Assign task to someone</option>
                <option value="add_badge">Add badge</option>
              </select>
            </div>

            {formData.actionType === "change_status" && (
                <div style={styles.formGroup}>
                  <label htmlFor="actionStatus">Change Status To</label>
                  <select
                      id="actionStatus"
                      name="status"
                      value={formData.actionValue.status}
                      onChange={handleActionValueChange}
                      style={styles.select}
                  >
                    {project.statuses.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                    ))}
                  </select>
                </div>
            )}

            {formData.actionType === "assign_user" && (
                <div style={styles.formGroup}>
                  <label htmlFor="actionUserId">Assign To</label>
                  <select
                      id="actionUserId"
                      name="userId"
                      value={formData.actionValue.userId}
                      onChange={handleActionValueChange}
                      style={styles.select}
                  >
                    {project.members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                    ))}
                  </select>
                </div>
            )}

            {formData.actionType === "add_badge" && (
                <div style={styles.formGroup}>
                  <label htmlFor="badge">Badge</label>
                  <select
                      id="badge"
                      name="badge"
                      value={formData.actionValue.badge}
                      onChange={handleActionValueChange}
                      style={styles.select}
                  >
                    <option value="Completed">Completed</option>
                    <option value="On Time">On Time</option>
                    <option value="Star Performer">Star Performer</option>
                  </select>
                  <div style={styles.badgePreview}>
                    <div style={styles.badgePreviewLabel}>Badge Preview:</div>
                    <div style={getBadgeStyle(formData.actionValue.badge)}>{formData.actionValue.badge}</div>
                  </div>
                </div>
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Create Automation
            </button>
          </div>
        </form>
      </div>
  )
}

// Helper function to get badge style
const getBadgeStyle = (badgeName) => {
  const colors = {
    Completed: { bg: "#e6f7ee", text: "#0d904f" },
    "On Time": { bg: "#e6f0ff", text: "#0066cc" },
    "Star Performer": { bg: "#fff8e6", text: "#cc8800" },
    default: { bg: "#f0f0f0", text: "#666666" },
  }

  const badgeColor = colors[badgeName] || colors.default

  return {
    display: "inline-block",
    backgroundColor: badgeColor.bg,
    color: badgeColor.text,
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "14px",
    marginTop: "5px",
  }
}

const styles = {
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  badgePreview: {
    marginTop: "10px",
  },
  badgePreviewLabel: {
    fontSize: "14px",
    marginBottom: "5px",
  },
}

export default AutomationForm
