const express = require("express");
const {
    getSkillAnalysis,
    getRecommendedProjects,
    generateProject,
    getUserProjects
} = require("../controllers/recommendationController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/analysis", getSkillAnalysis);
router.get("/projects", getRecommendedProjects);
router.post("/generate-project", generateProject);
router.get("/user-projects", getUserProjects);

module.exports = router;
