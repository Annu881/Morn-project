const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        badges: [
            {
                name: {
                    type: String,
                    required: true,
                },
                project: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Project",
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

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
