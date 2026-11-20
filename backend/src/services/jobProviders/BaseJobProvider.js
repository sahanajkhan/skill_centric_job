class BaseJobProvider {
    /**
     * @param {Object} options
     * @param {string} options.name - Human-friendly provider name
     * @param {string} options.providerId - Unique slug identifier
     * @param {string} options.apiName - Official API name
     * @param {string} options.website - Provider homepage
     * @param {string} options.apiDocs - Documentation link
     * @param {boolean} options.free - Whether fully open and free without cost
     * @param {boolean} options.freeTier - Whether a free tier exists
     * @param {boolean} options.authenticationRequired - Requires API key or token
     * @param {string} options.rateLimit - Quota or rate-limiting details
     * @param {string} options.badge - UI badge (e.g., 'Free / Open', 'Key Required')
     * @param {string} options.status - Current operational status
     * @param {string} options.limitation - Explicit documentation of limitations or required credentials
     */
    constructor({
        name,
        providerId,
        apiName,
        website,
        apiDocs = "",
        free = false,
        freeTier = false,
        authenticationRequired = false,
        rateLimit = "N/A",
        badge = "Standard",
        status = "Active",
        limitation = ""
    }) {
        this.name = name;
        this.providerId = providerId || name.toLowerCase().replace(/[^a-z0-9]/g, "_");
        this.apiName = apiName || `${name} API`;
        this.website = website;
        this.apiDocs = apiDocs || website;
        this.free = free;
        this.freeTier = freeTier;
        this.authenticationRequired = authenticationRequired;
        this.rateLimit = rateLimit;
        this.badge = badge;
        this.status = status;
        this.limitation = limitation;
    }

    /**
     * Returns transparency directory metadata for this provider
     */
    getMetadata() {
        return {
            provider: this.name,
            providerId: this.providerId,
            apiName: this.apiName,
            website: this.website,
            apiDocs: this.apiDocs,
            free: this.free,
            freeTier: this.freeTier,
            authenticationRequired: this.authenticationRequired,
            rateLimit: this.rateLimit,
            jobDataAvailable: this.isConfigured(),
            status: this.isConfigured() ? this.status : (this.authenticationRequired ? "Key Required" : this.status),
            badge: this.badge,
            limitation: this.limitation
        };
    }

    /**
     * Verifies if any required external environment variables / credentials are set
     * Subclasses should override if they require API keys
     */
    isConfigured() {
        return true;
    }

    /**
     * Fetch jobs conforming to the unified job schema.
     * Must be implemented by subclasses.
     * @param {Object} params
     * @param {string} [params.keyword]
     * @param {boolean} [params.remoteOnly]
     * @param {number} [params.limit]
     * @returns {Promise<Array<Object>>}
     */
    async fetchJobs({ keyword = "", remoteOnly = false, limit = 50 } = {}) {
        throw new Error(`fetchJobs() not implemented on ${this.constructor.name}`);
    }

    /**
     * Standardizes a job object into the unified platform schema
     */
    formatJob({
        sourceJobId,
        title,
        company,
        location = "Remote",
        remote = true,
        employmentType = "Full-time",
        description = "",
        skills = [],
        salary = "Competitive",
        jobUrl,
        applicationUrl,
        postedAt = "Recent"
    }) {
        const id = `${this.providerId}_${sourceJobId || Math.random().toString(36).substring(7)}`;
        return {
            sourceJobId: String(sourceJobId || id),
            jobId: id,
            title: title || "Software Engineer",
            company: company || "Hiring Company",
            location: location || "Remote",
            remote: Boolean(remote),
            employmentType: employmentType || "Full-time",
            description: description || "",
            skills: Array.isArray(skills) && skills.length ? skills : ["Software Development"],
            salary: salary || "Competitive",
            source: this.name,
            jobUrl: jobUrl || this.website,
            applicationUrl: applicationUrl || jobUrl || this.website,
            postedAt: postedAt || "Recent"
        };
    }
}

module.exports = BaseJobProvider;
