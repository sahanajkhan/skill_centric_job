const Job = require("../models/Job");
const aiService = require("./aiService");

const jobService = {
    // Seed and sync jobs from AI free provider collector
    syncLiveJobs: async (remoteOnly = false, keyword = "") => {
        try {
            const fetched = await aiService.fetchJobs(remoteOnly, keyword);
            if (!fetched || !fetched.length) return [];

            const operations = fetched.map(job => ({
                updateOne: {
                    filter: { jobId: job.id },
                    update: {
                        $set: {
                            jobId: job.id,
                            title: job.title,
                            company: job.company,
                            location: job.location,
                            remote: job.remote,
                            employmentType: job.employmentType || "Full-time",
                            skills: job.skills || [],
                            description: job.description || "",
                            salary: job.salary || "Competitive",
                            source: job.source || "Remotive",
                            jobUrl: job.jobUrl,
                            postedAt: job.postedAt || "Recent"
                        }
                    },
                    upsert: true
                }
            }));

            if (operations.length) {
                await Job.bulkWrite(operations);
            }

            return fetched;
        } catch (err) {
            console.error("Job sync error:", err.message);
            return [];
        }
    },

    // Get jobs with rich filtering
    getJobs: async (query = {}) => {
        const {
            search,
            skill,
            role,
            remote,
            location,
            source,
            limit = 50,
            page = 1
        } = query;

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { skills: { $in: [new RegExp(search, "i")] } }
            ];
        }

        if (skill) {
            filter.skills = { $in: [new RegExp(`^${skill}$`, "i")] };
        }

        if (role) {
            filter.title = { $regex: role, $options: "i" };
        }

        if (remote !== undefined && remote !== "") {
            filter.remote = remote === "true" || remote === true;
        }

        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        if (source) {
            filter.source = { $regex: source, $options: "i" };
        }

        // If collection is empty, trigger initial sync
        const totalCount = await Job.countDocuments();
        if (totalCount === 0) {
            await jobService.syncLiveJobs();
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const count = await Job.countDocuments(filter);

        return {
            jobs,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / parseInt(limit))
        };
    },

    // Get single job by id
    getJobById: async (jobId) => {
        let job = await Job.findOne({ jobId });
        if (!job) {
            job = await Job.findById(jobId).catch(() => null);
        }
        return job;
    },

    // Match jobs specifically for user profile
    getMatchedJobs: async (user, filters = {}) => {
        // Collect user skills safely
        let userSkills = [];
        if (user.skills && Array.isArray(user.skills)) {
            userSkills = user.skills
                .map(s => (s && typeof s === "object" && s.name ? s.name : (typeof s === "string" ? s : null)))
                .filter(Boolean);
        }
        if (user.manualSkills && Array.isArray(user.manualSkills)) {
            userSkills = [...userSkills, ...user.manualSkills];
        }
        if (user.resume && user.resume.extractedSkills && Array.isArray(user.resume.extractedSkills)) {
            userSkills = [...userSkills, ...user.resume.extractedSkills];
        }

        // Clean & deduplicate
        userSkills = Array.from(new Set(userSkills.filter(s => typeof s === "string" && s.trim())));

        // If no skills yet, provide fallback default
        if (!userSkills.length) {
            userSkills = ["React", "JavaScript", "Node.js", "MongoDB"];
        }

        // Fetch candidate jobs from DB or live
        let { jobs } = await jobService.getJobs({ limit: 100, ...filters });
        if (!jobs || !jobs.length) {
            await jobService.syncLiveJobs();
            const res = await jobService.getJobs({ limit: 100, ...filters });
            jobs = res.jobs;
        }

        // Convert Mongoose docs to plain objects
        const plainJobs = jobs.map(j => ({
            id: j.jobId,
            jobId: j.jobId,
            title: j.title,
            company: j.company,
            location: j.location,
            remote: j.remote,
            employmentType: j.employmentType,
            skills: j.skills,
            description: j.description,
            salary: j.salary,
            source: j.source,
            jobUrl: j.jobUrl,
            postedAt: j.postedAt
        }));

        // Run through transparent matcher
        const matched = await aiService.matchJobs(
            userSkills,
            plainJobs,
            user.targetRole || filters.role || "",
            filters.remote !== undefined ? filters.remote === "true" || filters.remote === true : user.preferredRemote,
            user.experienceLevel || "Mid"
        );

        return matched;
    },

    // Return API sources registry
    getJobSources: async () => {
        return await aiService.getJobSources();
    }
};

module.exports = jobService;
