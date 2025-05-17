const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    statuses: {
      type: [String],
      default: ["To Do", "In Progress", "Done"],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Project", projectSchema)
