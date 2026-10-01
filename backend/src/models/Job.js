const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        company: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        location: {
            type: String,
            default: "Remote",
            trim: true
        },
        remote: {
            type: Boolean,
            default: true,
            index: true
        },
        employmentType: {
            type: String,
            default: "Full-time"
        },
        skills: [
            {
                type: String,
                trim: true
            }
        ],
        description: {
            type: String,
            default: ""
        },
        salary: {
            type: String,
            default: "Competitive"
        },
        source: {
            type: String,
            default: "Remotive"
        },
        jobUrl: {
            type: String,
            required: true
        },
        postedAt: {
            type: String,
            default: "Recent"
        }
    },
    {
        timestamps: true
    }
);

jobSchema.index({ title: "text", company: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", jobSchema);
