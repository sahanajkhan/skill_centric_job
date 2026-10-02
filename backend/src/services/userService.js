const User = require("../models/User");
const SavedJob = require("../models/SavedJob");
const Application = require("../models/Application");
const GeneratedProject = require("../models/GeneratedProject");

const userService = {
    updateProfile: async (userId, updateData) => {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        ).populate("skills").select("-password");
        return user;
    },

    saveJob: async (userId, jobId, jobDetails, notes = "") => {
        const saved = await SavedJob.findOneAndUpdate(
            { user: userId, jobId },
            { $set: { jobDetails, notes } },
            { upsert: true, returnDocument: 'after' }
        );
        return saved;
    },

    getSavedJobs: async (userId) => {
        return await SavedJob.find({ user: userId }).sort({ createdAt: -1 });
    },

    removeSavedJob: async (userId, jobId) => {
        return await SavedJob.findOneAndDelete({ user: userId, jobId });
    },

    applyToJob: async (userId, jobId, jobTitle, company, notes = "") => {
        const application = await Application.findOneAndUpdate(
            { user: userId, jobId },
            { $set: { jobTitle, company, notes, status: "applied", appliedDate: new Date() } },
            { upsert: true, returnDocument: 'after' }
        );
        return application;
    },

    getApplications: async (userId) => {
        return await Application.find({ user: userId }).sort({ appliedDate: -1 });
    },

    saveGeneratedProject: async (userId, projectData) => {
        const project = await GeneratedProject.create({
            user: userId,
            ...projectData
        });
        return project;
    },

    getUserProjects: async (userId) => {
        return await GeneratedProject.find({ user: userId }).sort({ createdAt: -1 });
    }
};

module.exports = userService;
