const Skill = require("../models/Skill");

const createSkill = async (skillData) => {
    const existingSkill = await Skill.findOne({ name: skillData.name });
    if (existingSkill) {
        throw new Error("Skill already exists");
    }
    const skill = await Skill.create(skillData);
    return skill;
};

const getSkills = async () => {
    return await Skill.find().sort({ name: 1 });
};

module.exports = {
    createSkill,
    getSkills
};
