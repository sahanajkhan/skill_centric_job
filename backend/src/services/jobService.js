const Job = require("../models/Job");

const createJob = async(jobData) => {

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

    const jobs = await Job.find(filter)
    .populate("skills")
    .skip(skip)
    .limit(Number(limit));


    const total = await Job.countDocuments(filter);


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
    const job = await Job.findById(jobId)
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