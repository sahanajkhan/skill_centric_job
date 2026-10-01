const skillService = require("../services/skillService");
const aiService = require("../services/aiService");
const User = require("../models/User");

const addSkill = async (req, res, next) => {
    try {
        const { name, category } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });
        }

        // Normalize skill name via AI service
        const normalizedList = await aiService.normalizeSkills([name]);
        const normalizedName = normalizedList[0] || name.trim();

        const skill = await skillService.addSkillToUser(
            req.user._id,
            normalizedName,
            category
        );

        // Also update manualSkills array on User for fast lookup
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { manualSkills: normalizedName }
        });

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
        const user = await User.findById(req.user._id).populate("skills");
        const dbSkills = user.skills.map(s => s.name);
        const manualSkills = user.manualSkills || [];
        const resumeSkills = user.resume?.extractedSkills || [];

        const allSkills = [...new Set([...dbSkills, ...manualSkills, ...resumeSkills])];

        res.status(200).json({
            success: true,
            data: allSkills,
            detailed: user.skills,
            extractedFromResume: resumeSkills
        });
    } catch (error) {
        next(error);
    }
};

const removeSkill = async (req, res, next) => {
    try {
        const skillIdentifier = req.params.skillId;
        
        // Remove from DB reference if it's an ObjectId or by name
        try {
            await skillService.removeSkillFromUser(req.user._id, skillIdentifier);
        } catch (_) {}

        // Also remove from manualSkills array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                manualSkills: skillIdentifier,
                "resume.extractedSkills": skillIdentifier
            }
        });

        res.status(200).json({
            success: true,
            message: "Skill removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

const uploadResume = async (req, res, next) => {
    try {
        let fileBuffer = null;
        let filename = "";

        if (req.file) {
            fileBuffer = req.file.buffer;
            filename = req.file.originalname;
        }

        const rawText = req.body.rawText;

        if (!fileBuffer && !rawText) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume file (PDF/DOCX) or provide resume text"
            });
        }

        // Call AI extraction service
        const extracted = await aiService.extractResume(fileBuffer, filename, rawText);

        const extractedSkills = extracted.detectedSkills || [];

        // Save to User profile and link skills
        const user = await User.findById(req.user._id);
        user.resume = {
            filename: filename || "Pasted Text",
            path: "",
            extractedSkills
        };

        // Add extracted skills to user's manual/verified skills
        for (const s of extractedSkills) {
            try {
                await skillService.addSkillToUser(user._id, s);
            } catch (_) {}
            if (!user.manualSkills.includes(s)) {
                user.manualSkills.push(s);
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `Successfully extracted ${extractedSkills.length} skills from resume`,
            data: {
                extractedSkills,
                categorized: extracted.categorizedSkills,
                totalFound: extracted.totalSkillsFound,
                allSkills: user.manualSkills
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSkill,
    getSkills,
    removeSkill,
    uploadResume
};
