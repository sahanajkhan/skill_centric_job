const axios = require("axios");

const fetchArbeitnowJobs = async () => {
    try {
        const response = await axios.get("https://www.arbeitnow.com/api/job-board-api", { timeout: 10000 });
        const jobs = response.data?.data || [];

        return jobs.map(j => ({
            sourceJobId: String(j.slug || j.title),
            jobId: `arbeitnow_${j.slug || Math.random().toString(36).substring(7)}`,
            title: j.title || "Software Engineer",
            company: j.company_name || "Company",
            location: j.location || "Europe / Remote",
            remote: Boolean(j.remote),
            employmentType: j.job_types && j.job_types[0] ? j.job_types[0] : "Full-time",
            description: j.description || "",
            skills: j.tags && j.tags.length ? j.tags : ["Engineering", "Web Development"],
            salary: "Competitive",
            source: "Arbeitnow",
            jobUrl: j.url || "https://www.arbeitnow.com",
            applicationUrl: j.url || "https://www.arbeitnow.com",
            postedAt: j.created_at ? new Date(j.created_at * 1000).toISOString().split("T")[0] : "Recent"
        }));
    } catch (error) {
        console.warn("Arbeitnow job provider failed gracefully:", error.message);
        return [];
    }
};

module.exports = {
    name: "Arbeitnow",
    fetchJobs: fetchArbeitnowJobs
};
