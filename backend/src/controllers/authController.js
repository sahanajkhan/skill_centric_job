const authService = require("../services/authService");

const register = async(req, res, next) => {
    try{
        const result = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });

    }

       catch(error){
             next(error);
        }
};


const login = async(req, res, next) => {
    try{
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: " login successful",
            data: result
        });
    }

    catch(error){
        next(error);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }
        
        const result = await authService.googleLogin(token);
        
        res.status(200).json({
            success: true,
            message: "Google login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async(req,res,next) => {
    try{
        res.status(200).json({
            succcess: true,
            data: req.user
        });
    }

    catch(error){
        next(error);
    }
};

module.exports = {
     register,
     login,
     googleLogin,
     getMe
};


