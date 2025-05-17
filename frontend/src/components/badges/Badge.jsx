"use client"

const Badge = ({ name, size = "small" }) => {
    // Define badge colors based on name
    const getBadgeColor = (badgeName) => {
        const colors = {
            Completed: { bg: "#e6f7ee", text: "#0d904f" },
            "On Time": { bg: "#e6f0ff", text: "#0066cc" },
            "Star Performer": { bg: "#fff8e6", text: "#cc8800" },
            default: { bg: "#f0f0f0", text: "#666666" },
        }

        return colors[badgeName] || colors.default
    }

    const badgeColor = getBadgeColor(name)

    // Define size styles
    const sizeStyles = {
        small: {
            padding: "2px 6px",
            fontSize: "12px",
            borderRadius: "4px",
        },
        medium: {
            padding: "4px 8px",
            fontSize: "14px",
            borderRadius: "4px",
        },
        large: {
            padding: "6px 12px",
            fontSize: "16px",
            borderRadius: "6px",
        },
    }

    const style = {
        display: "inline-block",
        backgroundColor: badgeColor.bg,
        color: badgeColor.text,
        fontWeight: "bold",
        ...sizeStyles[size],
    }

    return <span style={style}>{name}</span>
}

export default Badge
