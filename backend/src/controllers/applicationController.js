const userService = require("../services/userService");

const applyToJob = async (req, res, next) => {
    try {
        const { jobId, jobTitle, company, notes } = req.body;
        if (!jobId || !jobTitle || !company) {
            return res.status(400).json({
                success: false,
                message: "jobId, jobTitle, and company are required"
            });
        }
        const application = await userService.applyToJob(
            req.user._id,
            jobId,
            jobTitle,
            company,
            notes
        );
        res.status(201).json({
            success: true,
            message: "Application recorded successfully",
            data: application
        });
    } catch (err) {
        next(err);
    }
};

const getApplications = async (req, res, next) => {
    try {
        const applications = await userService.getApplications(req.user._id);
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    applyToJob,
    getApplications
};
