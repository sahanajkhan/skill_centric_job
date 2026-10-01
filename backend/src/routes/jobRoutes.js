const express = require("express");
const {
    getJobs,
    getJobById,
    getFeed,
    syncJobs,
    getJobSources
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/sources", getJobSources);
router.post("/sync", syncJobs);
router.get("/feed", protect, getFeed);
router.get("/", getJobs);
router.get("/:id", getJobById);

module.exports = router;
