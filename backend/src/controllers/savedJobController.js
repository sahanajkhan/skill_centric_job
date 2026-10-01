const userService = require("../services/userService");

const saveJob = async (req, res, next) => {
    try {
        const { jobId, jobDetails, notes } = req.body;
        if (!jobId || !jobDetails) {
            return res.status(400).json({
                success: false,
                message: "jobId and jobDetails are required"
            });
        }
        const saved = await userService.saveJob(req.user._id, jobId, jobDetails, notes);
        res.status(201).json({
            success: true,
            message: "Job saved successfully",
            data: saved
        });
    } catch (err) {
        next(err);
    }
};

const getSavedJobs = async (req, res, next) => {
    try {
        const saved = await userService.getSavedJobs(req.user._id);
        res.status(200).json({
            success: true,
            count: saved.length,
            data: saved
        });
    } catch (err) {
        next(err);
    }
};

const removeSavedJob = async (req, res, next) => {
    try {
        await userService.removeSavedJob(req.user._id, req.params.jobId);
        res.status(200).json({
            success: true,
            message: "Saved job removed"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};
