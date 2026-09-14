const savedJobService = require("../services/savedJobService");

const saveJob = async (req, res, next) => {
    try {
        const savedJob = await savedJobService.saveJob(req.user._id, req.params.jobId);
        res.status(201).json({
            success: true,
            message: "Job saved successfully",
            data: savedJob
        });
    } catch (error) {
        next(error);
    }
};

const getSavedJobs = async (req, res, next) => {
    try {
        const savedJobs = await savedJobService.getSavedJobs(req.user._id);
        res.status(200).json({
            success: true,
            data: savedJobs
        });
    } catch (error) {
        next(error);
    }
};

const removeSavedJob = async (req, res, next) => {
    try {
        await savedJobService.removeSavedJob(req.user._id, req.params.jobId);
        res.status(200).json({
            success: true,
            message: "Saved job removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};
