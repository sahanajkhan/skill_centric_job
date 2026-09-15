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
            required: function() { return this.authProvider === 'local'; },
            minLength: 6
        },

        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        resume: {
            filename: String,
            path: String
        },

        bio: {
            type: String,
            default: ''
        },

        title: {
            type: String,
            default: ''
        },

        experience: [
            {
                company: String,
                role: String,
                startDate: String,
                endDate: String,
                description: String
            }
        ],

        education: [
            {
                institution: String,
                degree: String,
                year: String
            }
        ],

        socialLinks: {
            linkedin: { type: String, default: '' },
            github: { type: String, default: '' },
            portfolio: { type: String, default: '' }
        }


    },


    {
        timestamps: true
    }
);



module.exports = mongoose.model("User", userSchema);