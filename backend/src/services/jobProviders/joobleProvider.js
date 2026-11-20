const axios = require("axios");
const BaseJobProvider = require("./BaseJobProvider");

class JoobleProvider extends BaseJobProvider {
    constructor() {
        super({
            name: "Jooble",
            providerId: "jooble",
            apiName: "Jooble Search API",
            website: "https://jooble.org",
            apiDocs: "https://jooble.org/api/about",
            free: false,
            freeTier: true,
            authenticationRequired: true,
            rateLimit: "500 queries/day free tier",
            badge: "Free Tier — Limited",
            status: "Key Required",
            limitation: "Requires free JOOBLE_API_KEY from https://jooble.org/api/about. Delivers worldwide aggregated vacancy feeds."
        });
    }

    isConfigured() {
        return Boolean(process.env.JOOBLE_API_KEY);
    }

    async fetchJobs({ keyword = "software", remoteOnly = false, limit = 25 } = {}) {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const apiKey = process.env.JOOBLE_API_KEY;
            const url = `https://jooble.org/api/${apiKey}`;
            const response = await axios.post(url, {
                keywords: keyword || "software",
                location: remoteOnly ? "Remote" : "",
                page: 1
            }, { timeout: 10000 });

            const jobs = response.data?.jobs || [];
            return jobs.slice(0, limit).map(j => this.formatJob({
                sourceJobId: String(j.id),
                title: j.title?.replace(/<[^>]*>?/gm, ""),
                company: j.company || "Company",
                location: j.location || "Remote",
                remote: Boolean(remoteOnly || /remote/i.test(j.location || "")),
                employmentType: j.type || "Full-time",
                description: j.snippet?.replace(/<[^>]*>?/gm, "") || "",
                skills: ["Technology"],
                salary: j.salary || "Competitive",
                jobUrl: j.link || this.website,
                applicationUrl: j.link || this.website,
                postedAt: j.updated ? j.updated.split("T")[0] : "Recent"
            }));
        } catch (error) {
            console.warn("Jooble provider fetch failed gracefully:", error.message);
            return [];
        }
    }
}

module.exports = new JoobleProvider();
