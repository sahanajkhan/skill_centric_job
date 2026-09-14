const SavedJob = require("../models/SavedJob");

const saveJob = async (userId, jobId) => {
    const existing = await SavedJob.findOne({ user: userId, job: jobId });
    if (existing) {
        throw new Error("Job is already saved");
    }
    return await SavedJob.create({ user: userId, job: jobId });
};

const getSavedJobs = async (userId) => {
    return await SavedJob.find({ user: userId }).populate("job").sort({ createdAt: -1 });
};

const removeSavedJob = async (userId, jobId) => {
    const result = await SavedJob.findOneAndDelete({ user: userId, job: jobId });
    if (!result) {
        throw new Error("Saved job not found");
    }
    return result;
};

module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};
