const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            required: true,
            default: "To Do",
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        badges: [
            {
                name: {
                    type: String,
                    required: true,
                },
                awardedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true },
)

module.exports = mongoose.model("Task", taskSchema)
