const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token: generateToken(user._id)
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token: generateToken(user._id)
    };
};

const googleLogin = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        // Create user if not exists
        user = await User.create({
            name,
            email,
            authProvider: 'google',
            googleId
        });
    } else if (user.authProvider !== 'google') {
        // If user exists but isn't a google user, you could either 
        // link accounts or return an error. Here we'll just link it
        // by updating the auth provider and googleId.
        user.authProvider = 'google';
        user.googleId = googleId;
        await user.save();
    }

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
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