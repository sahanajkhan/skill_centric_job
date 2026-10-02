const express = require("express");
const {
    addSkill,
    getSkills,
    updateSkill,
    removeSkill,
    uploadResume
} = require("../controllers/skillController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", addSkill);
router.get("/", getSkills);
router.post("/resume", upload.single("resume"), uploadResume);
router.put("/:id", updateSkill);
router.delete("/:id", removeSkill);

module.exports = router;
