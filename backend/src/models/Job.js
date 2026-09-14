const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
            default: "Full-time"
        },
        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],
        salary: {
            type: String,
            default: "Not specified"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);
