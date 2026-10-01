const express = require("express");
const multer = require("multer");
const {
    addSkill,
    getSkills,
    removeSkill,
    uploadResume
} = require("../controllers/skillController");
const protect = require("../middleware/authMiddleware");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.use(protect);

router.post("/", addSkill);
router.get("/", getSkills);
router.delete("/:skillId", removeSkill);
router.post("/resume", upload.single("resume"), uploadResume);

module.exports = router;
