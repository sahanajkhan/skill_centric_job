const axios = require("axios");
const BaseJobProvider = require("./BaseJobProvider");

class RemotiveProvider extends BaseJobProvider {
    constructor() {
        super({
            name: "Remotive",
            providerId: "remotive",
            apiName: "Remotive Public API",
            website: "https://remotive.com",
            apiDocs: "https://remotive.com/api/remote-jobs",
            free: true,
            freeTier: true,
            authenticationRequired: false,
            rateLimit: "Public access, no API key required",
            badge: "Free / Open",
            status: "Active",
            limitation: "Specializes exclusively in remote tech jobs."
        });
    }

    async fetchJobs({ keyword = "", remoteOnly = true, limit = 50 } = {}) {
        try {
            const url = keyword
                ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}`
                : `https://remotive.com/api/remote-jobs?limit=${encodeURIComponent(limit)}`;

            const response = await axios.get(url, { timeout: 10000 });
            const jobs = response.data?.jobs || [];

            return jobs.map(j => this.formatJob({
                sourceJobId: String(j.id),
                title: j.title,
                company: j.company_name,
                location: j.candidate_required_location || "Remote",
                remote: true,
                employmentType: j.job_type || "Full-time",
                description: j.description || "",
                skills: j.tags && j.tags.length ? j.tags : ["JavaScript", "React", "Node.js"],
                salary: j.salary || "Competitive",
                jobUrl: j.url,
                applicationUrl: j.url,
                postedAt: j.publication_date ? new Date(j.publication_date).toISOString().split("T")[0] : "Recent"
            }));
        } catch (error) {
            console.warn("Remotive job provider fetch failed gracefully:", error.message);
            return [];
        }
    }
}

module.exports = new RemotiveProvider();
