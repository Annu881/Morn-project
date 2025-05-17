"use client"

import BadgesList from "../badges/BadgesList"

const TaskList = ({ tasks, statuses, onStatusChange, onDelete, members }) => {
  // Group tasks by status
  const tasksByStatus = {}
  statuses.forEach((status) => {
    tasksByStatus[status] = tasks.filter((task) => task.status === status)
  })

  const handleStatusChange = (taskId, newStatus) => {
    onStatusChange(taskId, { status: newStatus })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getAssigneeName = (assignee) => {
    if (!assignee) return "Unassigned"
    return assignee.name || "Unknown User"
  }

  return (
      <div style={styles.kanbanBoard}>
        {statuses.map((status, statusIndex) => (
            <div key={`status-${statusIndex}`} style={styles.kanbanColumn}>
              <div style={styles.kanbanColumnHeader}>
                {status} ({tasksByStatus[status].length})
              </div>
              {tasksByStatus[status].map((task) => (
                  <div key={task._id || `task-${Math.random()}`} style={styles.taskCard}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    {task.description && <div style={styles.taskDescription}>{task.description}</div>}

                    {task.badges && task.badges.length > 0 && (
                        <div style={styles.badgesContainer}>
                          <BadgesList badges={task.badges} />
                        </div>
                    )}

                    <div style={styles.taskMeta}>
                      <div>Due: {formatDate(task.dueDate)}</div>
                      <div>Assignee: {getAssigneeName(task.assignee)}</div>
                    </div>
                    <div style={styles.taskActions}>
                      <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          style={styles.statusSelect}
                      >
                        {statuses.map((s, i) => (
                            <option key={`option-${task._id}-${i}`} value={s}>
                              Move to {s}
                            </option>
                        ))}
                      </select>
                      <button onClick={() => onDelete(task._id)} style={styles.deleteButton}>
                        Delete
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        ))}
      </div>
  )
}

const styles = {
  kanbanBoard: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "16px",
  },
  kanbanColumn: {
    minWidth: "280px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: "12px",
  },
  kanbanColumnHeader: {
    fontWeight: "bold",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #ddd",
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: "4px",
    padding: "12px",
    marginBottom: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  taskTitle: {
    fontWeight: "bold",
    marginBottom: "4px",
  },
  taskDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  badgesContainer: {
    marginBottom: "8px",
  },
  taskMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#666",
    marginBottom: "8px",
  },
  taskActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  statusSelect: {
    padding: "4px",
    fontSize: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  deleteButton: {
    padding: "4px 8px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  },
}

export default TaskList
