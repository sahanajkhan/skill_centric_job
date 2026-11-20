const userService = require("../services/userService");
const User = require("../models/User");

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate("skills").select("-password");
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = [
            "name",
            "targetRole",
            "experienceLevel",
            "preferredRemote",
            "manualSkills"
        ];
        const updateData = {};
        allowedUpdates.forEach(key => {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        });

        const updated = await userService.updateProfile(req.user._id, updateData);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile,
    updateProfile
};
