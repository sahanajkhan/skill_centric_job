const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const generateToken = (userId) => {
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};


const registerUser = async({name, email,password}) => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new Error("User already exits");
    }

    const hashedpassword =  await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        email,
        password: hashedpassword
    });

    return {
        user:{
            id: user._id,
            name: user.name,
            email: user.email
        },
        token: generateToken(user._id);
    };
};


const loginUser = async({email, password}) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Invalid emial or password");
    }
    const isMatch = await becrpt.compare(password,user.password);


    if(!isMatch){
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

module.exports = {
    registerUser,
    loginUser,
    generateToken
};