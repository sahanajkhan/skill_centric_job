const axios = require("axios");

const fetchRemotiveJobs = async (keyword = "") => {
    try {
        const url = keyword
            ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}`
            : "https://remotive.com/api/remote-jobs?limit=50";

        const response = await axios.get(url, { timeout: 10000 });
        const jobs = response.data?.jobs || [];

        return jobs.map(j => ({
            sourceJobId: String(j.id),
            jobId: `remotive_${j.id}`,
            title: j.title || "Software Developer",
            company: j.company_name || "Confidential",
            location: j.candidate_required_location || "Remote",
            remote: true,
            employmentType: j.job_type || "Full-time",
            description: j.description || "",
            skills: j.tags && j.tags.length ? j.tags : ["JavaScript", "React", "Node.js"],
            salary: j.salary || "Competitive",
            source: "Remotive",
            jobUrl: j.url || "https://remotive.com",
            applicationUrl: j.url || "https://remotive.com",
            postedAt: j.publication_date ? new Date(j.publication_date).toISOString().split("T")[0] : "Recent"
        }));
    } catch (error) {
        console.warn("Remotive job provider failed gracefully:", error.message);
        return [];
    }
};

module.exports = {
    name: "Remotive",
    fetchJobs: fetchRemotiveJobs
};
