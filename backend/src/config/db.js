const mongoose = require("mongoose");

const connectDB = async (retries = 3, delay = 2000) => {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skill_centric";

    const options = {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority"
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const connection = await mongoose.connect(mongoURI, options);
            console.log(`MongoDB connected: ${connection.connection.host}`);
            return connection;
        } catch (error) {
            console.warn(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 1.5;
            } else {
                console.error("All MongoDB connection attempts exhausted.");
                if (process.env.NODE_ENV === "production" || !process.env.ALLOW_OFFLINE_DB) {
                    throw error;
                }
            }
        }
    }
};

module.exports = connectDB;