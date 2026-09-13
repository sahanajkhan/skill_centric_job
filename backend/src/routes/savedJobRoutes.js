const express = require("express");

const {
    saveJob,
    getSavedJobs,
    removeSavedJob
} = require("../controllers/savedJobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/:jobId", saveJob);
router.get("/", getSavedJobs);
router.delete("/:jobId", removeSavedJob);

module.exports = router;
