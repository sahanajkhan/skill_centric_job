const axios = require("axios");
const BaseJobProvider = require("./BaseJobProvider");

class AdzunaProvider extends BaseJobProvider {
    constructor() {
        super({
            name: "Adzuna",
            providerId: "adzuna",
            apiName: "Adzuna Job Search API",
            website: "https://www.adzuna.com",
            apiDocs: "https://developer.adzuna.com",
            free: false,
            freeTier: true,
            authenticationRequired: true,
            rateLimit: "250 queries/month free tier limit",
            badge: "Free Tier — Limited",
            status: "Key Required",
            limitation: "Requires ADZUNA_APP_ID and ADZUNA_APP_KEY in .env. Free tier offers 250 requests/month across US, UK, EU markets."
        });
    }

    isConfigured() {
        return Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
    }

    async fetchJobs({ keyword = "developer", remoteOnly = false, limit = 25 } = {}) {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const country = process.env.ADZUNA_COUNTRY || "us";
            const appId = process.env.ADZUNA_APP_ID;
            const appKey = process.env.ADZUNA_APP_KEY;
            const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=${limit}&what=${encodeURIComponent(keyword || "developer")}`;

            const response = await axios.get(url, { timeout: 10000 });
            const results = response.data?.results || [];

            return results.map(item => this.formatJob({
                sourceJobId: String(item.id),
                title: item.title?.replace(/<[^>]*>?/gm, ""),
                company: item.company?.display_name || "Confidential",
                location: item.location?.display_name || "US",
                remote: Boolean(remoteOnly || (item.title && /remote/i.test(item.title))),
                employmentType: item.contract_time || "Full-time",
                description: item.description?.replace(/<[^>]*>?/gm, "") || "",
                skills: ["Software Engineering"],
                salary: item.salary_min && item.salary_max ? `$${Math.round(item.salary_min)} - $${Math.round(item.salary_max)}` : "Competitive",
                jobUrl: item.redirect_url || this.website,
                applicationUrl: item.redirect_url || this.website,
                postedAt: item.created ? item.created.split("T")[0] : "Recent"
            }));
        } catch (error) {
            console.warn("Adzuna provider fetch failed gracefully:", error.message);
            return [];
        }
    }
}

module.exports = new AdzunaProvider();
