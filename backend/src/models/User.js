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