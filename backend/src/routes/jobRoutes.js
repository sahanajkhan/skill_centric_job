

const express = require("express");

const {
    createJob,
    getJObs,
    getJobByid
} = reuire("../controllers/jobController");


const router = express.Router();

router.post("/", createJob);
router.get("/",getJObs);
router.get("/:jobId", getJobByid);

module.exports = router;