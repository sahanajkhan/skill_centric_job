const mongoose = require("mongoose");

const generatedProjectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true
        },
        targetRole: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            default: "Intermediate"
        },
        problemStatement: String,
        features: [String],
        technologyStack: Object,
        databaseSchema: Object,
        apiDesign: Array,
        folderStructure: String,
        implementationPlan: Array,
        developmentTasks: [String],
        testingStrategy: String,
        deploymentStrategy: String,
        skillsTargeted: Object
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("GeneratedProject", generatedProjectSchema);
