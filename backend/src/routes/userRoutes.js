const express = require("express");

const {
    getProfile,
    updateprofile
} = require("../controllers/userController");


const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/profile" ,getProfile);
router.put("/profile", updateprofile);


module.exports = router;