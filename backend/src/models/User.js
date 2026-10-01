const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],
        manualSkills: [
            {
                type: String,
                trim: true
            }
        ],
        targetRole: {
            type: String,
            default: "Full Stack Developer",
            trim: true
        },
        experienceLevel: {
            type: String,
            enum: ["Entry / Junior", "Mid", "Senior", "Lead"],
            default: "Mid"
        },
        preferredRemote: {
            type: Boolean,
            default: true
        },
        resume: {
            filename: String,
            path: String,
            extractedSkills: [String]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);