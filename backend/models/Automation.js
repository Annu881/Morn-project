const mongoose = require("mongoose")

const automationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    trigger: {
      type: {
        type: String,
        enum: ["status_change", "assignee_change", "due_date_passed"],
        required: true,
      },
      condition: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    action: {
      type: {
        type: String,
        enum: ["change_status", "assign_user", "add_badge"],
        required: true,
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Automation", automationSchema)
