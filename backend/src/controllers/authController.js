const authService = require("../services/authService");

const register = async(req, res, next) => {
    try{
        const result = await authService.registerUser(req.body);

        res.stats(201).json({
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

const getMe = sync(req,res,next) => {
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
     getMe
};


