const User = require("../models/User");
const Skill = require("../models/Skill");

const getUserProfile = async (userId) => {
    const user = await User.findById(userId).populate("skills");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

const updateUserProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).populate("skills");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

const addUserSkill = async (userId, skillId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    
    if (user.skills.includes(skillId)) {
        throw new Error("Skill already added to user");
    }

    user.skills.push(skillId);
    await user.save();
    return await User.findById(userId).populate("skills");
};

const removeUserSkill = async (userId, skillId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.skills = user.skills.filter(id => id.toString() !== skillId.toString());
    await user.save();
    return await User.findById(userId).populate("skills");
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    addUserSkill,
    removeUserSkill
};
