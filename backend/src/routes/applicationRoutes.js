const express = require("express");
const {
    applyToJob,
    getApplications
} = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", applyToJob);
router.get("/", getApplications);

module.exports = router;
