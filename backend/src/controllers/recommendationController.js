const jobService = require("../services/jobService");
const User = require("../models/User");

const getRecommendations = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate("skills");
        
        if (!user || user.skills.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No skills found to generate recommendations",
                data: []
            });
        }

        const skillIds = user.skills.map(skill => skill._id);
        
        // Find jobs that require at least one of the user's skills
        const Job = require("../models/Job");
        const recommendedJobs = await Job.find({
            skills: { $in: skillIds },
            isActive: true
        }).populate("skills").limit(10);

        res.status(200).json({
            success: true,
            data: recommendedJobs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecommendations
};
