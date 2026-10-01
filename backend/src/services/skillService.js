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

module.exports = {
    addSkillToUser,
    getUserSkills,
    removeSkillFromUser
};
