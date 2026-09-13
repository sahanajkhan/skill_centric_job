

const applicationService = require("../services/applicationService");

const applyForJob = async (req, res, next) => {
    try {
        const application =
            await applicationService.applyForJob(
                req.user._id,
                req.params.jobId
            );

        res.status(201).json({
            success: true,
            message: "Application created successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
};

const getApplications = async (req, res, next) => {
    try {
        const applications =
            await applicationService.getApplications(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const application =
            await applicationService.updateApplicationStatus(
                req.user._id,
                req.params.applicationId,
                status
            );

        res.status(200).json({
            success: true,
            message: "Application status updated",
            data: application
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyForJob,
    getApplications,
    updateApplicationStatus
};
