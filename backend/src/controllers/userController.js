const User = require("../models/User");

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("skills")
            .select("-password");

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.resume = {
            filename: req.file.filename,
            path: req.file.path
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: user.resume
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadResume
};