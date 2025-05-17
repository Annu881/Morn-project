"use client"

import Badge from "./Badge.jsx"

const BadgesList = ({ badges, size = "small" }) => {
    if (!badges || badges.length === 0) {
        return null
    }

    return (
        <div style={styles.container}>
            {badges.map((badge, index) => (
                <div key={`badge-${index}`} style={styles.badgeItem}>
                    <Badge name={badge.name} size={size} />
                </div>
            ))}
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },
    badgeItem: {
        marginBottom: "4px",
    },
}

export default BadgesList
