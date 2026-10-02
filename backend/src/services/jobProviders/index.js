const remotiveProvider = require("./remotiveProvider");
const arbeitnowProvider = require("./arbeitnowProvider");

const providers = [remotiveProvider, arbeitnowProvider];

const fetchAllProviderJobs = async (remoteOnly = false, keyword = "") => {
    const providerPromises = providers.map(async (provider) => {
        try {
            const jobs = await provider.fetchJobs(keyword);
            if (remoteOnly) {
                return jobs.filter(j => j.remote);
            }
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
    fetchAllProviderJobs
};
