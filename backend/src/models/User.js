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
            required: function () {
                return !this.authProvider || this.authProvider === "local";
            },
            minLength: 6,
            select: false
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },
        googleId: {
            type: String,
            default: null
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
            extractedSkills: [String],
            uploadedAt: Date
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("User", userSchema);