const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        jobId: {
            type: String,
            required: true
        },
        jobTitle: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["applied", "interviewing", "offer", "rejected"],
            default: "applied"
        },
        appliedDate: {
            type: Date,
            default: Date.now
        },
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index({ user: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
