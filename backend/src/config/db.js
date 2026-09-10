const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected: ${connection.connection.host}`);

    }
    catch(error){
        Controller.error(`mongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};


module.exports = connectDB;