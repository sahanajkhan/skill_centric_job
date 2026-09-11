const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Skill-Centric Backend API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);

app.use(errorHandler);

module.exports = app;