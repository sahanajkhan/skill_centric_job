const axios = require("axios");
const BaseJobProvider = require("./BaseJobProvider");

class ArbeitnowProvider extends BaseJobProvider {
    constructor() {
        super({
            name: "Arbeitnow",
            providerId: "arbeitnow",
            apiName: "Arbeitnow European & Global Jobs API",
            website: "https://www.arbeitnow.com",
            apiDocs: "https://www.arbeitnow.com/api/job-board-api",
            free: true,
            freeTier: true,
            authenticationRequired: false,
            rateLimit: "Public access, no key required",
            badge: "Free / Open",
            status: "Active",
            limitation: "Focuses on tech, remote, and European opportunities with visa sponsorship tags."
        });
    }

    async fetchJobs({ keyword = "", remoteOnly = false, limit = 50 } = {}) {
        try {
            const response = await axios.get("https://www.arbeitnow.com/api/job-board-api", { timeout: 10000 });
            let jobs = response.data?.data || [];

            if (remoteOnly) {
                jobs = jobs.filter(j => j.remote);
            }

            if (keyword) {
                const kw = keyword.toLowerCase();
                jobs = jobs.filter(j =>
                    (j.title && j.title.toLowerCase().includes(kw)) ||
                    (j.company_name && j.company_name.toLowerCase().includes(kw)) ||
                    (Array.isArray(j.tags) && j.tags.some(t => t.toLowerCase().includes(kw)))
                );
            }

            return jobs.slice(0, limit).map(j => this.formatJob({
                sourceJobId: String(j.slug || j.title),
                title: j.title,
                company: j.company_name,
                location: j.location || "Europe / Remote",
                remote: Boolean(j.remote),
                employmentType: j.job_types && j.job_types[0] ? j.job_types[0] : "Full-time",
                description: j.description || "",
                skills: j.tags && j.tags.length ? j.tags : ["Engineering", "Web Development"],
                salary: "Market rate",
                jobUrl: j.url,
                applicationUrl: j.url,
                postedAt: j.created_at ? new Date(j.created_at * 1000).toISOString().split("T")[0] : "Recent"
            }));
        } catch (error) {
            console.warn("Arbeitnow job provider fetch failed gracefully:", error.message);
            return [];
        }
    }
}

module.exports = new ArbeitnowProvider();
