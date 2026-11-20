const remotiveProvider = require("./remotiveProvider");
const arbeitnowProvider = require("./arbeitnowProvider");
const usajobsProvider = require("./usajobsProvider");
const adzunaProvider = require("./adzunaProvider");
const joobleProvider = require("./joobleProvider");
const enterpriseProvider = require("./enterpriseProvider");

const providers = [
    remotiveProvider,
    arbeitnowProvider,
    usajobsProvider,
    adzunaProvider,
    joobleProvider,
    enterpriseProvider
];

/**
 * Returns metadata list for all supported providers (Free, Key-Required, and Restricted)
 */
const getProvidersMetadata = () => {
    return providers.map(p => p.getMetadata());
};

/**
 * Fetch jobs across all actively configured providers concurrently
 */
const fetchAllProviderJobs = async (remoteOnly = false, keyword = "") => {
    const activeProviders = providers.filter(p => p.isConfigured());

    const providerPromises = activeProviders.map(async (provider) => {
        try {
            const jobs = await provider.fetchJobs({ keyword, remoteOnly, limit: 50 });
            return jobs;
        } catch (err) {
            console.warn(`Provider ${provider.name} error:`, err.message);
            return [];
        }
    });

    const results = await Promise.allSettled(providerPromises);
    const aggregated = [];

    for (const result of results) {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
            aggregated.push(...result.value);
        }
    }

    return aggregated;
};

module.exports = {
    providers,
    getProvidersMetadata,
    fetchAllProviderJobs
};
