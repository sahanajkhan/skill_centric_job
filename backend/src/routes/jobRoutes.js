const express = require("express");
const {
    getJobs,
    getJobById,
    getFeed,
    getRecommendedJobs,
    searchJobs,
    matchJobs,
    syncJobs,
    getJobSources
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/sources", getJobSources);
router.post("/sync", syncJobs);
router.get("/sync", syncJobs);
router.get("/search", searchJobs);
router.get("/feed", protect, getFeed);
router.get("/recommended", protect, getRecommendedJobs);
router.get("/match", protect, matchJobs);
router.get("/", getJobs);
router.get("/:id", getJobById);

module.exports = router;
