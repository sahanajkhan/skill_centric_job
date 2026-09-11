
const skillService = require("../services/skillService");

const addSkill = async (req, res, next) => {
    try {
        const { name, category } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });
        }

        const skill = await skillService.addSkillToUser(
            req.user._id,
            name,
            category
        );

        res.status(201).json({
            success: true,
            message: "Skill added successfully",
            data: skill
        });
    } catch (error) {
        next(error);
    }
};

const getSkills = async (req, res, next) => {
    try {
        const skills = await skillService.getUserSkills(
            req.user._id
        );

        res.status(200).json({
            success: true,
            data: skills
        });
    } catch (error) {
        next(error);
    }
};

const removeSkill = async (req, res, next) => {
    try {
        await skillService.removeSkillFromUser(
            req.user._id,
            req.params.skillId
        );

        res.status(200).json({
            success: true,
            message: "Skill removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSkill,
    getSkills,
    removeSkill
};

