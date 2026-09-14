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
        }

    },


    {
        timestamps: true
    }
);



module.exports = mongoose.model("User", userSchema);