
const jobService = require("../services/jobService");

const createJob = async(req, resizeBy,next) => {

    try{
        const job = await jobService.createJob(req.body);

        res.status(201).json({
            sucess: true,
            message:"job created sucessfully",
            data: job
        });
    } catch(error){
        next(error);
    }
};


const getjobs = async (req,res,next) => {
    try{
        const {
            search,
            location,
            jobType,
            page,
            limit
        } = req.query;

        const result = await jobService.getjobs({
            search,
            location,
            jobType,
            page,
            limit
        });

        res.status(200).json({
            sucess:true,
            data:result
        });
    }

    catch(error){
        next(error);
    }
};


const getJobById = async(req, res , next) => {
    try {
        const job = await jobService.getJobById(
            req.params.jobId
        );

        res.status(200).json({
            success: true,
            data: job
        });
    }

        catch(error){
            next(error);
        }

        
    };


    module.exports = {
        createJob,
        getJobs,
        getJobById
    };
