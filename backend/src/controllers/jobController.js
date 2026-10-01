const jobService = require("../services/jobService");

const getJobs = async (req, res, next) => {
    try {
        const result = await jobService.getJobs(req.query);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (err) {
        next(err);
    }
};

const getJobById = async (req, res, next) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (err) {
        next(err);
    }
};

const getFeed = async (req, res, next) => {
    try {
        const user = req.user;
        const matched = await jobService.getMatchedJobs(user, req.query);
        res.status(200).json({
            success: true,
            count: matched.length,
            data: matched
        });
    } catch (err) {
        next(err);
    }
};

const syncJobs = async (req, res, next) => {
    try {
        const { remoteOnly, keyword } = req.body;
        const synced = await jobService.syncLiveJobs(remoteOnly, keyword);
        res.status(200).json({
            success: true,
            message: `Synchronized ${synced.length} live jobs from official free providers`,
            count: synced.length
        });
    } catch (err) {
        next(err);
    }
};

const getJobSources = async (req, res, next) => {
    try {
        const sources = await jobService.getJobSources();
        res.status(200).json({
            success: true,
            data: sources
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getJobs,
    getJobById,
    getFeed,
    syncJobs,
    getJobSources
};
