const mongoose = require("mongoose");
const User = require("../models/User");
const Skill = require("../models/Skill");

const addSkillToUser = async (userId, name, category) => {
    let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

    if (!skill) {
        skill = await Skill.create({
            name: name.trim(),
            category: category ? category.trim() : undefined
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const alreadyAdded = user.skills.some(
        (id) => id.toString() === skill._id.toString()
    );

    if (!alreadyAdded) {
        user.skills.push(skill._id);
        await user.save();
    }

    return skill;
};

const getUserSkills = async (userId) => {
    const user = await User.findById(userId).populate("skills");
    if (!user) {
        throw new Error("User not found");
    }
    return user.skills;
};

const removeSkillFromUser = async (userId, skillId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.skills = user.skills.filter(
        (id) => id.toString() !== skillId.toString()
    );
    await user.save();
    return true;
};

const updateSkillForUser = async (userId, skillIdentifier, newName, newCategory) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const trimmedNewName = newName ? newName.trim() : "";
    if (!trimmedNewName) {
        const error = new Error("Skill name is required for update");
        error.statusCode = 400;
        throw error;
    }

    let newSkillDoc = await Skill.findOne({ name: { $regex: new RegExp(`^${trimmedNewName}$`, "i") } });
    if (!newSkillDoc) {
        newSkillDoc = await Skill.create({
            name: trimmedNewName,
            category: newCategory ? newCategory.trim() : undefined
        });
    }

    // Remove old skill if it was an ObjectId reference
    if (skillIdentifier && mongoose.Types.ObjectId.isValid(skillIdentifier)) {
        user.skills = user.skills.filter(id => id.toString() !== skillIdentifier);
    }

    // Replace in manualSkills array if string match
    if (user.manualSkills && user.manualSkills.includes(skillIdentifier)) {
        const idx = user.manualSkills.indexOf(skillIdentifier);
        user.manualSkills[idx] = trimmedNewName;
    } else if (!user.manualSkills.includes(trimmedNewName)) {
        user.manualSkills.push(trimmedNewName);
    }

    const alreadyLinked = user.skills.some(id => id.toString() === newSkillDoc._id.toString());
    if (!alreadyLinked) {
        user.skills.push(newSkillDoc._id);
    }

    await user.save();
    return newSkillDoc;
};

module.exports = {
    addSkillToUser,
    getUserSkills,
    removeSkillFromUser,
    updateSkillForUser
};
