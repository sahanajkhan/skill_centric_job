const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
let client = null;
try {
    const { OAuth2Client } = require("google-auth-library");
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "dummy");
} catch (err) {
    console.warn("google-auth-library not loaded or unavailable");
}

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "fallback_secret_key_skill_centric";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    return jwt.sign({ userId }, secret, { expiresIn });
};

const registerUser = async ({ name, email, password, targetRole }) => {
    if (!name || !email || !password) {
        const error = new Error("Please provide name, email, and password");
        error.statusCode = 400;
        throw error;
    }

    if (password.length < 6) {
        const error = new Error("Password must be at least 6 characters long");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        targetRole: targetRole ? targetRole.trim() : "Full Stack Developer"
    });

    return {
        user: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            targetRole: user.targetRole,
            skills: user.skills || [],
            manualSkills: user.manualSkills || []
        },
        token: generateToken(user._id)
    };
};

const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        const error = new Error("Please provide email and password");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password").populate("skills");

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return {
        user: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            targetRole: user.targetRole,
            experienceLevel: user.experienceLevel,
            preferredRemote: user.preferredRemote,
            skills: user.skills || [],
            manualSkills: user.manualSkills || [],
            resume: user.resume || {}
        },
        token: generateToken(user._id)
    };
};

const googleLogin = async (token) => {
    if (!client) {
        const error = new Error("Google authentication is not configured");
        error.statusCode = 501;
        throw error;
    }

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            authProvider: 'google',
            googleId
        });
    } else if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        user.googleId = googleId;
        await user.save();
    }

    return {
        user: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            targetRole: user.targetRole
        },
        token: generateToken(user._id)
    };
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    generateToken
};