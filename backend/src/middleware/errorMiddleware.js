const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
    let message = err.message || "Internal server error";

    // Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `Duplicate value for ${field}. Please use another value.`;
    }

    // Handle Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found with id ${err.value}`;
    }

    // Handle JWT Errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired token";
    }

    // Handle Multer Errors
    if (err.name === "MulterError") {
        statusCode = 400;
        message = `File upload error: ${err.message}`;
    }

    if (process.env.NODE_ENV === "development") {
        console.error("DEBUG ERROR:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

module.exports = errorHandler;