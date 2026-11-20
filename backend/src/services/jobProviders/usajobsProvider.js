const axios = require("axios");
const BaseJobProvider = require("./BaseJobProvider");

class USAJobsProvider extends BaseJobProvider {
    constructor() {
        super({
            name: "USAJobs",
            providerId: "usajobs",
            apiName: "USAJobs Open Data API",
            website: "https://www.usajobs.gov",
            apiDocs: "https://developer.usajobs.gov/API-Reference",
            free: true,
            freeTier: true,
            authenticationRequired: true,
            rateLimit: "Public developer key required (free tier available)",
            badge: "Free Developer API",
            status: "Key Required",
            limitation: "Requires free USAJobs Developer authorization header (USAJOBS_API_KEY and USAJOBS_EMAIL in .env). Returns official federal tech and engineering positions."
        });
    }

    isConfigured() {
        return Boolean(process.env.USAJOBS_API_KEY && process.env.USAJOBS_EMAIL);
    }

    async fetchJobs({ keyword = "Software", remoteOnly = false, limit = 25 } = {}) {
        if (!this.isConfigured()) {
            // Clean limitation reporting - DO NOT fake or fabricate responses
            return [];
        }

        try {
            const url = `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(keyword)}&ResultsPerPage=${limit}${remoteOnly ? "&Telework=true" : ""}`;
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": process.env.USAJOBS_EMAIL,
                    "Authorization-Key": process.env.USAJOBS_API_KEY
                },
                timeout: 10000
            });

            const items = response.data?.SearchResult?.SearchResultItems || [];
            return items.map(item => {
                const desc = item.MatchedObjectDescriptor || {};
                return this.formatJob({
                    sourceJobId: String(desc.PositionID || desc.PositionURI),
                    title: desc.PositionTitle,
                    company: desc.OrganizationName || "US Federal Government",
                    location: desc.PositionLocationDisplay || (remoteOnly ? "Remote" : "USA"),
                    remote: Boolean(desc.TeleworkEligible || remoteOnly),
                    employmentType: desc.PositionOfferingType?.[0]?.Name || "Full-time",
                    description: desc.UserArea?.Details?.JobSummary || "",
                    skills: ["Government Engineering", "Compliance", "Systems"],
                    salary: desc.PositionRemuneration?.[0] ? `$${desc.PositionRemuneration[0].MinimumRange} - $${desc.PositionRemuneration[0].MaximumRange}` : "Competitive",
                    jobUrl: desc.PositionURI || this.website,
                    applicationUrl: desc.ApplyURI?.[0] || desc.PositionURI || this.website,
                    postedAt: desc.PublicationStartDate ? desc.PublicationStartDate.split("T")[0] : "Recent"
                });
            });
        } catch (error) {
            console.warn("USAJobs provider fetch failed gracefully:", error.message);
            return [];
        }
    }
}

module.exports = new USAJobsProvider();
