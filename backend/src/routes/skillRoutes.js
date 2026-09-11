const express = require("express");

const {
    addSkill,
    getSkills,
    removeSkill
} = require("../controllers/skillController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", addSkill);
router.get("/", getSkills);
router.delete("/:skillId", removeSkill);

module.exports = router;
