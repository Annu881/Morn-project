"use client"

import { useState } from "react"

const TaskForm = ({ onSubmit, onCancel, project, task }) => {
  const [formData, setFormData] = useState({
    title: task ? task.title : "",
    description: task ? task.description : "",
    dueDate: task && task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    status: task ? task.status : project.statuses[0],
    assigneeId: task && task.assignee ? task.assignee._id : "",
  })
  const [error, setError] = useState("")

  const { title, description, dueDate, status, assigneeId } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!title) {
      setError("Title is required")
      return
    }

    onSubmit(formData)
  }

  return (
      <div style={styles.formContainer}>
        <h3>{task ? "Edit Task" : "Create New Task"}</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={title} onChange={onChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                style={styles.textarea}
                rows="3"
            ></textarea>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="dueDate">Due Date</label>
            <input type="date" id="dueDate" name="dueDate" value={dueDate} onChange={onChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={status} onChange={onChange} style={styles.select}>
              {project.statuses.map((s, index) => (
                  <option key={`status-${index}`} value={s}>
                    {s}
                  </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="assigneeId">Assignee</label>
            <select id="assigneeId" name="assigneeId" value={assigneeId} onChange={onChange} style={styles.select}>
              <option value="">Unassigned</option>
              {project.members &&
                  project.members.map((member) => (
                      <option key={member._id || `member-${Math.random()}`} value={member._id}>
                        {member.name || "Unknown User"}
                      </option>
                  ))}
            </select>
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
  )
}

const styles = {
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    resize: "vertical",
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
}

export default TaskForm
