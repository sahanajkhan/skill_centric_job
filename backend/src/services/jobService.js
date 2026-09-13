const job = require("../models/Job");

const creatjob = async(jobData) => {

    const job = await Job.create(jobData);

    return job;
};

const getJobs = async({
    search,
    location,
    jobType,
    page = 1,
    limit = 10
}) => {
    const filter = {
        isActive: true
    };

    if(search){
        filter.$or  = [
            {
                title:{
                    $regex: search,
                    $options: "i"
                }
            },
            {
                company: {
                    $regex: search,
                    $options:"i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    if(location){
        filter.location = {
            $regex : location,
            $options : "i"
        };

    }

    if(jobType){
        filter.jobType = jobType;
    }

    const skip = (page - 1) * limit;

    const jobs = await job.find(filter)
    .populate("skills")
    .sort(skip)
    .limit(Number(limit));


    const total = await job.countDocuments(filter);


    return{
        jobs,
        pagination : {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages : Math.ceil(total / limit)
        }
    };
};


const getJobById = async(jobId) => {
    const job = await job.findbyId(jobId)
    .populate("skills");


    if(!job){
        throw new Error("job not found");
    }

    return job;
};


module.exports = {
    createJob,
    getJobs,
    getJobById
};