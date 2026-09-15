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

        // Fetch AI recommendations from FastAPI
        const axios = require('axios');
        let aiData;
        try {
            const response = await axios.get('http://localhost:8000/api/recommendations');
            aiData = response.data;
        } catch (error) {
            console.error("Failed to fetch from AI backend:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to connect to AI recommendation engine",
                error: error.message
            });
        }

        // Map AI data to frontend expected format
        const formattedJobs = (aiData.top_jobs || []).map((job, index) => ({
            id: index + 1000, // Generate a unique ID for mock purposes
            title: job.title,
            company: job.company,
            location: "Remote",
            salary: "Competitive",
            job_type: "Full-time",
            experience: "Flexible",
            description: "AI Recommended Job based on your skills.",
            required_skills: [...(job.matching_skills || []), ...(job.missing_skills || [])],
            matching_skills: job.matching_skills || [],
            missing_skills: job.missing_skills || [],
            match_score: Math.round(job.score || 0),
            sources: [
                { name: "AI Match", url: "#" }
            ]
        }));

        res.status(200).json({
            success: true,
            data: formattedJobs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecommendations
};
