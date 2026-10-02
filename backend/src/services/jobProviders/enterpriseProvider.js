const BaseJobProvider = require("./BaseJobProvider");

class EnterpriseProvider extends BaseJobProvider {
    constructor() {
        super({
            name: "LinkedIn / Indeed",
            providerId: "enterprise_aggregator",
            apiName: "Enterprise Partner APIs (LinkedIn / Indeed)",
            website: "https://linkedin.com",
            apiDocs: "https://learn.microsoft.com/en-us/linkedin/talent/",
            free: false,
            freeTier: false,
            authenticationRequired: true,
            rateLimit: "Commercial contract only",
            badge: "Paid / Restricted",
            status: "Enterprise Only",
            limitation: "LinkedIn & Indeed do not offer free open REST APIs for job aggregation. Programmatic automated web scraping violates their terms of service. Access is reserved exclusively for registered ATS/Recruiting enterprise partners with direct corporate billing. All active listings on Skill-Centric are sourced exclusively from compliant open APIs."
        });
    }

    isConfigured() {
        return false;
    }

    async fetchJobs() {
        // Explicitly return empty array - Never fabricate fake listings
        return [];
    }
}

module.exports = new EnterpriseProvider();
