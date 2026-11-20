const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        sourceJobId: {
            type: String,
            default: ""
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
        experience: {
            type: String,
            default: "Mid Level"
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
            default: "Remotive",
            index: true
        },
        jobUrl: {
            type: String,
            required: true
        },
        applicationUrl: {
            type: String,
            default: function () {
                return this.jobUrl;
            }
        },
        postedAt: {
            type: String,
            default: "Recent"
        },
        fetchedAt: {
            type: Date,
            default: Date.now
        },
        matchScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

jobSchema.index({ source: 1, sourceJobId: 1 });
jobSchema.index({ title: "text", company: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", jobSchema);
