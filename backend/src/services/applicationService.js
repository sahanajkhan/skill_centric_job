const Application = require("../models/Application");

const applyForJob = async (userId, jobId) => {
    const existing = await Application.findOne({
        user: userId,
        job: jobId
    });

    if (existing) {
        throw new Error("You have already applied for this job");
    }

    return await Application.create({
        user: userId,
        job: jobId
    });
};

const getApplications = async (userId) => {
    return await Application.find({
        user: userId
    })
        .populate("job")
        .sort({ appliedAt: -1 });
};

const updateApplicationStatus = async (
    userId,
    applicationId,
    status
) => {
    const application = await Application.findOne({
        _id: applicationId,
        user: userId
    });

    if (!application) {
        throw new Error("Application not found");
    }

    application.status = status;

    await application.save();

    return application;
};

module.exports = {
    applyForJob,
    getApplications,
    updateApplicationStatus
};

