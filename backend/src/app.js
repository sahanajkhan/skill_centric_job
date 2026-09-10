const express = require("express");
    const cors = require("cors");
    const app = express();


    app.use(cors());
    app.use(express.json);


    app.get("/",(req,res) =>{
        res.status(200).json({
            success:true,
            message: "Skill-centric backend API is running"

        });
    });

    app.get("/api/health",(req,res) => {
        res.status(200).json({
            success: true,
            message: "Server is healthy"
        });
    });


    module.exports = app;

    