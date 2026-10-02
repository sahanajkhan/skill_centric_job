const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
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
        jobDetails: {
            type: Object,
            required: true
        },
        notes: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["saved", "applied", "interviewing", "offer", "rejected"],
            default: "saved"
        }
    },
    {
        timestamps: true
    }
);

savedJobSchema.index({ user: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobSchema);
