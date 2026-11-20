const userService = require("./userService");

const saveJob = async (userId, jobId, jobDetails, notes = "") => {
    return await userService.saveJob(userId, jobId, jobDetails, notes);
};

const getSavedJobs = async (userId) => {
    return await userService.getSavedJobs(userId);
};

const removeSavedJob = async (userId, jobId) => {
    return await userService.removeSavedJob(userId, jobId);
};

module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};
