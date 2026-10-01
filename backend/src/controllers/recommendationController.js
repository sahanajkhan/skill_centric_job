const aiService = require("../services/aiService");
const userService = require("../services/userService");

const getSkillAnalysis = async (req, res, next) => {
    try {
        const user = req.user;
        let skills = [];
        if (user.skills && user.skills.length) {
            skills = user.skills.map(s => (typeof s === "object" ? s.name : s));
        }
        if (user.manualSkills && user.manualSkills.length) {
            skills = [...new Set([...skills, ...user.manualSkills])];
        }
        if (user.resume && user.resume.extractedSkills) {
            skills = [...new Set([...skills, ...user.resume.extractedSkills])];
        }

        const analysis = await aiService.analyzeSkills(skills, user.targetRole);
        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (err) {
        next(err);
    }
};

const getRecommendedProjects = async (req, res, next) => {
    try {
        const user = req.user;
        let skills = [];
        if (user.skills && user.skills.length) {
            skills = user.skills.map(s => (typeof s === "object" ? s.name : s));
        }
        if (user.manualSkills) {
            skills = [...new Set([...skills, ...user.manualSkills])];
        }

        const projects = await aiService.recommendProjects(skills, user.targetRole);
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};

const generateProject = async (req, res, next) => {
    try {
        const {
            targetRole,
            existingSkills,
            missingSkills,
            difficulty,
            preferredStack,
            jobRequirements
        } = req.body;

        const blueprint = await aiService.generateProjectPlan({
            targetRole: targetRole || req.user.targetRole || "Full Stack Developer",
            existingSkills: existingSkills || req.user.manualSkills || [],
            missingSkills: missingSkills || ["Docker", "AWS"],
            difficulty: difficulty || "Intermediate",
            preferredStack: preferredStack || "Fullstack",
            jobRequirements: jobRequirements || ""
        });

        // Persist for user history
        const saved = await userService.saveGeneratedProject(req.user._id, blueprint);

        res.status(201).json({
            success: true,
            message: "Project blueprint generated successfully",
            data: saved
        });
    } catch (err) {
        next(err);
    }
};

const getUserProjects = async (req, res, next) => {
    try {
        const projects = await userService.getUserProjects(req.user._id);
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSkillAnalysis,
    getRecommendedProjects,
    generateProject,
    getUserProjects
};
