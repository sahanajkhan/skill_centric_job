const User = require("../models/User");
const user = require("../models/User");

const getprofile = async(req, res, next) => {
    try{
        const user = await User.findbyId(req.user._id)
        .populate("skills")
        .select("-password");


        res.status(200).json({
            sucess: true,
            data: user
        });

    }
    catch(error){
        next(error);
    
    }
};


const updateProfile = async(req, res,next) => {
    try{ 
        const{name, email} = req.body;

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            });

        }

        if(name){
            user.name = name;
        }

        if(email){
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated sucessfully",
            data:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch(error){
        next(error);
    }
};

module.exports = {
    getprofile,
    updateProfile
};