
const express = require("express");

const {
    applyForJob,
    getApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/job/:jobId", applyForJob);
router.get("/", getApplications);
router.put(
    "/:applicationId",
    updateApplicationStatus
);

module.exports = router;

