const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const jobRoutes = require("./routes/jobRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorMiddleware");
const aiService = require("./services/aiService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Skill-Centric Unified Backend API is active",
        endpoints: {
            auth: "/api/auth",
            skills: "/api/skills",
            jobs: "/api/jobs",
            savedJobs: "/api/saved-jobs",
            applications: "/api/applications",
            recommendations: "/api/recommendations",
            users: "/api/users"
        }
    });
});

app.get("/api/health", async (req, res) => {
    const aiStatus = await aiService.checkHealth();
    res.status(200).json({
        success: true,
        message: "Backend server is healthy",
        services: {
            backend: "healthy",
            ai_microservice: aiStatus
        }
    });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

module.exports = app;