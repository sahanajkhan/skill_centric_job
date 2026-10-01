const axios = require("axios");

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const aiClient = axios.create({
    baseURL: AI_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Fallback metadata for job sources
const FALLBACK_SOURCES = [
    {
        provider: "Remotive",
        apiName: "Remotive Public API",
        website: "https://remotive.com",
        free: true,
        freeTier: true,
        authenticationRequired: false,
        rateLimit: "Public access, no key required",
        jobDataAvailable: true,
        status: "Active",
        badge: "Free / Open"
    },
    {
        provider: "Arbeitnow",
        apiName: "Arbeitnow European & Global Jobs API",
        website: "https://www.arbeitnow.com",
        free: true,
        freeTier: true,
        authenticationRequired: false,
        rateLimit: "Public access, no key required",
        jobDataAvailable: true,
        status: "Active",
        badge: "Free / Open"
    },
    {
        provider: "USAJobs",
        apiName: "USAJobs Open Data API",
        website: "https://developer.usajobs.gov",
        free: true,
        freeTier: true,
        authenticationRequired: true,
        rateLimit: "Public developer key required",
        jobDataAvailable: true,
        status: "Active",
        badge: "Free Developer API"
    },
    {
        provider: "Adzuna",
        apiName: "Adzuna Job Search API",
        website: "https://developer.adzuna.com",
        free: false,
        freeTier: true,
        authenticationRequired: true,
        rateLimit: "250 queries/month free tier limit",
        jobDataAvailable: true,
        status: "Key Required",
        badge: "Free Tier — Limited"
    },
    {
        provider: "Jooble",
        apiName: "Jooble Search API",
        website: "https://jooble.org/api/about",
        free: false,
        freeTier: true,
        authenticationRequired: true,
        rateLimit: "500 queries/day free tier",
        jobDataAvailable: true,
        status: "Key Required",
        badge: "Free Tier — Limited"
    },
    {
        provider: "LinkedIn / Indeed",
        apiName: "Enterprise Partner APIs",
        website: "https://linkedin.com",
        free: false,
        freeTier: false,
        authenticationRequired: true,
        rateLimit: "Commercial / Enterprise contract only",
        jobDataAvailable: false,
        status: "Paid Enterprise",
        badge: "Paid / Restricted"
    }
];

const aiService = {
    // Check health of Python AI microservice
    checkHealth: async () => {
        try {
            const res = await aiClient.get("/health");
            return res.data;
        } catch (err) {
            return { status: "degraded", message: "AI service connection offline, using native fallback" };
        }
    },

    // Extract skills from resume file or text
    extractResume: async (fileBuffer, filename, rawText) => {
        try {
            if (fileBuffer && filename) {
                const formData = new FormData();
                const blob = new Blob([fileBuffer]);
                formData.append("file", blob, filename);
                const res = await axios.post(`${AI_BASE_URL}/api/extract-resume`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                return res.data;
            } else if (rawText) {
                const formData = new FormData();
                formData.append("raw_text", rawText);
                const res = await axios.post(`${AI_BASE_URL}/api/extract-resume`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                return res.data;
            }
        } catch (err) {
            console.warn("AI extractResume falling back to heuristic parsing:", err.message);
        }

        // Resilient fallback heuristic parsing
        const text = rawText || (fileBuffer ? fileBuffer.toString("utf-8") : "");
        const commonSkills = ["React", "JavaScript", "TypeScript", "Node.js", "Express", "Python", "MongoDB", "SQL", "Docker", "Git", "AWS", "FastAPI", "Tailwind CSS"];
        const found = commonSkills.filter(s => new RegExp(`\\b${s}\\b`, "i").test(text));
        return {
            success: true,
            detectedSkills: found.length ? found : ["React", "JavaScript", "Node.js", "MongoDB"],
            categorizedSkills: { core: found },
            totalSkillsFound: found.length
        };
    },

    // Normalize skill list
    normalizeSkills: async (skills) => {
        try {
            const res = await aiClient.post("/api/normalize-skills", { skills });
            return res.data.normalized;
        } catch (err) {
            // Heuristic aliases
            const aliasMap = {
                "reactjs": "React",
                "react.js": "React",
                "node": "Node.js",
                "nodejs": "Node.js",
                "mongo": "MongoDB",
                "js": "JavaScript",
                "ts": "TypeScript",
                "postgres": "PostgreSQL"
            };
            return skills.map(s => aliasMap[s.trim().toLowerCase()] || s.trim());
        }
    },

    // LLM Skill Analysis
    analyzeSkills: async (skills, targetRole, resumeText) => {
        try {
            const res = await aiClient.post("/api/analyze-skills", {
                skills,
                targetRole,
                resumeText
            });
            return res.data.data;
        } catch (err) {
            console.warn("AI analyzeSkills fallback:", err.message);
            const strong = skills.slice(0, Math.ceil(skills.length / 2));
            const intermediate = skills.slice(Math.ceil(skills.length / 2));
            return {
                skills,
                strong_skills: strong,
                intermediate_skills: intermediate,
                beginner_skills: [],
                missing_skills: ["Docker", "AWS", "CI/CD", "TypeScript", "Testing"].filter(s => !skills.includes(s)),
                recommended_roles: [targetRole || "Full Stack Developer", "Backend Engineer", "Frontend Engineer"],
                recommended_projects: [
                    {
                        title: "Fullstack Job Matcher & Dashboard",
                        skillsUsed: skills.slice(0, 3),
                        skillsToLearn: ["Docker", "CI/CD"],
                        difficulty: "Intermediate"
                    }
                ]
            };
        }
    },

    // Get metadata of all API sources
    getJobSources: async () => {
        try {
            const res = await aiClient.get("/api/job-sources");
            return res.data.data;
        } catch (err) {
            return FALLBACK_SOURCES;
        }
    },

    // Fetch live jobs from free APIs
    fetchJobs: async (remoteOnly = false, keyword = "") => {
        try {
            const res = await aiClient.post("/api/fetch-jobs", {
                remoteOnly,
                keyword
            });
            return res.data.data;
        } catch (err) {
            console.warn("AI fetchJobs fallback:", err.message);
            return [];
        }
    },

    // Transparent weighted matching
    matchJobs: async (userSkills = [], jobs = [], targetRole = "", preferredRemote = false, experienceLevel = "Mid", customWeights = null) => {
        const cleanSkills = (userSkills || []).map(s => (typeof s === "string" ? s.trim() : (s && s.name ? String(s.name).trim() : ""))).filter(Boolean);
        const cleanJobs = (jobs || []).map(j => ({
            id: j.id || j.jobId,
            jobId: j.jobId || j.id,
            title: j.title || "Software Engineer",
            company: j.company || "Tech Company",
            location: j.location || "Remote",
            remote: Boolean(j.remote),
            employmentType: j.employmentType || "Full-time",
            skills: (j.skills || []).map(s => String(s).trim()).filter(Boolean),
            description: j.description || "",
            salary: j.salary || "Competitive",
            source: j.source || "Remotive",
            jobUrl: j.jobUrl || "https://remotive.com",
            postedAt: j.postedAt || "Recent"
        }));

        try {
            const res = await aiClient.post("/api/match-jobs", {
                userSkills: cleanSkills,
                jobs: cleanJobs.length ? cleanJobs : undefined,
                targetRole: targetRole || "",
                preferredRemote: Boolean(preferredRemote),
                experienceLevel: experienceLevel || "Mid",
                customWeights: customWeights || undefined
            });
            return res.data.data;
        } catch (err) {
            console.warn("AI matchJobs fallback:", err.message);
            return cleanJobs.map(j => {
                const jobSkills = j.skills;
                const matched = jobSkills.filter(s => cleanSkills.some(us => us.toLowerCase() === s.toLowerCase()));
                const missing = jobSkills.filter(s => !cleanSkills.some(us => us.toLowerCase() === s.toLowerCase()));
                const score = jobSkills.length ? Math.round((matched.length / jobSkills.length) * 100) : 60;
                return {
                    ...j,
                    matchPercentage: score,
                    matchedSkills: matched,
                    missingSkills: missing,
                    matchingReasons: [`Matches ${matched.length} core skills`],
                    skillGap: missing
                };
            });
        }
    },

    // Recommend projects based on skills and gaps
    recommendProjects: async (skills, targetRole) => {
        try {
            const res = await aiClient.post("/api/recommend-projects", {
                skills,
                targetRole
            });
            return res.data.data;
        } catch (err) {
            return [
                {
                    title: `Production ${targetRole || "Full Stack"} Portfolio Platform`,
                    skillsUsed: skills.slice(0, 3),
                    skillsToLearn: ["Docker", "AWS", "Testing"],
                    difficulty: "Intermediate"
                }
            ];
        }
    },

    // Generate complete AI project blueprint
    generateProjectPlan: async (params) => {
        try {
            const res = await aiClient.post("/api/generate-project-plan", params);
            return res.data.data;
        } catch (err) {
            console.warn("AI generateProjectPlan fallback:", err.message);
            const role = params.targetRole || "Software Engineer";
            const gap = params.missingSkills?.[0] || "Docker";
            return {
                title: `Scalable ${role} System with ${gap}`,
                difficulty: params.difficulty || "Intermediate",
                targetRole: role,
                problemStatement: `Enterprise application built to master ${gap} while leveraging your strengths in ${params.existingSkills?.join(", ")}.`,
                features: ["JWT Authentication", "High-throughput REST API", "Responsive UI", "Automated Tests"],
                technologyStack: {
                    frontend: "React, Vite, CSS",
                    backend: "Node.js, Express",
                    database: "MongoDB",
                    cloud: gap
                },
                databaseSchema: { User: { id: "ObjectId", name: "String", email: "String" } },
                apiDesign: [{ method: "GET", endpoint: "/api/items", description: "Fetch data" }],
                folderStructure: "src/\n  components/\n  controllers/\n  models/",
                implementationPlan: [{ phase: "Phase 1", detail: "Scaffold environment and DB" }],
                developmentTasks: ["Setup project repo", "Build REST endpoints", "Integrate UI"],
                testingStrategy: "Unit test controllers and API endpoints",
                deploymentStrategy: "Containerize with Docker, deploy to cloud",
                skillsTargeted: { existing: params.existingSkills, gapBridged: params.missingSkills }
            };
        }
    }
};

module.exports = aiService;
