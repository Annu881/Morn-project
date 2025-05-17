"use client"

import Badge from "../badges/Badge"

const AutomationList = ({ automations, onDelete, isOwner }) => {
  const getTriggerDescription = (automation) => {
    const { type, condition } = automation.trigger

    if (type === "status_change") {
      return `When task status changes to "${condition.status}"`
    } else if (type === "assignee_change") {
      return `When task is assigned to a user`
    } else if (type === "due_date_passed") {
      return `When task due date passes`
    }

    return "Unknown trigger"
  }

  const getActionDescription = (automation) => {
    const { type, value } = automation.action

    if (type === "change_status") {
      return `Change task status to "${value.status}"`
    } else if (type === "assign_user") {
      return `Assign task to a user`
    } else if (type === "add_badge") {
      return (
          <div style={styles.badgeAction}>
            Add badge: <Badge name={value.badge} />
          </div>
      )
    }

    return "Unknown action"
  }

  if (automations.length === 0) {
    return <p>No automations created yet.</p>
  }

  return (
      <div style={styles.automationList}>
        {automations.map((automation) => (
            <div key={automation._id} style={styles.automationCard}>
              <div style={styles.automationContent}>
                <div style={styles.triggerSection}>
                  <div style={styles.sectionTitle}>Trigger:</div>
                  <div>{getTriggerDescription(automation)}</div>
                </div>
                <div style={styles.actionSection}>
                  <div style={styles.sectionTitle}>Action:</div>
                  <div>{getActionDescription(automation)}</div>
                </div>
              </div>
              {isOwner && (
                  <button onClick={() => onDelete(automation._id)} style={styles.deleteButton}>
                    Delete
                  </button>
              )}
            </div>
        ))}
      </div>
  )
}

const styles = {
  automationList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  automationCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  automationContent: {
    flex: 1,
  },
  triggerSection: {
    marginBottom: "10px",
  },
  actionSection: {
    color: "#4a6ee0",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  badgeAction: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
}

export default AutomationList
