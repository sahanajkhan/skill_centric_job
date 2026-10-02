const assert = require("assert");
const http = require("http");
require("dotenv").config();

let BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000";
let ephemeralServer = null;

async function ensureServerRunning() {
    try {
        const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
            console.log(`Connected to running backend at ${BASE_URL}`);
            return;
        }
    } catch (_) {
        // Server not running, start ephemeral test server
        console.log("No running server detected on default port. Launching ephemeral test server...");
        const connectDB = require("../src/config/db");
        const app = require("../src/app");
        await connectDB();
        const testPort = 5055;
        ephemeralServer = app.listen(testPort);
        BASE_URL = `http://localhost:${testPort}`;
        console.log(`Ephemeral test server listening on ${BASE_URL}`);
    }
}

async function runBackendTests() {
    await ensureServerRunning();

    console.log("====================================================");
    console.log(" Starting Backend & Integration Verification Suite  ");
    console.log("====================================================");

    // 1. Health Probe
    const healthRes = await fetch(`${BASE_URL}/api/health`).then(r => r.json());
    assert.strictEqual(healthRes.success, true);
    assert.strictEqual(healthRes.services.backend, "healthy");
    console.log("✓ 1. Health Check Passed (Backend active)");

    // 2. Job Sources Transparency
    const sourcesRes = await fetch(`${BASE_URL}/api/jobs/sources`).then(r => r.json());
    assert.strictEqual(sourcesRes.success, true);
    assert.ok(sourcesRes.data.length >= 2);
    const remotive = sourcesRes.data.find(s => s.provider === "Remotive");
    assert.strictEqual(remotive.free, true);
    console.log(`✓ 2. API Sources Registry Passed (${sourcesRes.data.length} providers tracked with limitations documented)`);

    // 3. User Registration
    const testEmail = `test_runner_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Automated Test Runner",
            email: testEmail,
            password: "password123",
            targetRole: "Full Stack Developer"
        })
    }).then(r => r.json());
    assert.strictEqual(regRes.success, true);
    const token = regRes.data.token;
    assert.ok(token);
    console.log("✓ 3. Authentication: User Registration Passed");

    // 4. User Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: testEmail,
            password: "password123"
        })
    }).then(r => r.json());
    assert.strictEqual(loginRes.success, true);
    assert.ok(loginRes.data.token);
    console.log("✓ 4. Authentication: User Login Passed");

    // 5. Current User /auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    assert.strictEqual(meRes.success, true);
    assert.strictEqual(meRes.data.email, testEmail);
    console.log("✓ 5. Authentication: GET /api/auth/me Passed");

    // 6. Add Skills with Normalization (POST /api/skills)
    const addSkillRes = await fetch(`${BASE_URL}/api/skills`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: "ReactJS", category: "Frameworks" })
    }).then(r => r.json());
    assert.strictEqual(addSkillRes.success, true);
    assert.strictEqual(addSkillRes.data.name, "React"); // Normalized ReactJS -> React
    console.log("✓ 6. Skills: Add & Auto-Normalization Passed (ReactJS -> React)");

    // 7. Get Skills (GET /api/skills)
    const getSkillsRes = await fetch(`${BASE_URL}/api/skills`, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    assert.strictEqual(getSkillsRes.success, true);
    assert.ok(Array.isArray(getSkillsRes.data));
    assert.ok(getSkillsRes.data.includes("React"));
    console.log("✓ 7. Skills: GET /api/skills Passed");

    // 8. Update Skill (PUT /api/skills/:id)
    const updateSkillRes = await fetch(`${BASE_URL}/api/skills/React`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: "React 19", category: "Frontend" })
    }).then(r => r.json());
    assert.strictEqual(updateSkillRes.success, true);
    console.log("✓ 8. Skills: PUT /api/skills/:id Passed");

    // 9. Jobs Search & Pagination (GET /api/jobs)
    const jobsRes = await fetch(`${BASE_URL}/api/jobs?limit=10&page=1`).then(r => r.json());
    assert.strictEqual(jobsRes.success, true);
    assert.ok(Array.isArray(jobsRes.jobs));
    console.log(`✓ 9. Jobs: Search & Pagination Passed (${jobsRes.jobs.length} jobs returned, page ${jobsRes.page})`);

    // 10. Get Personalized AI Feed / Recommended Jobs (GET /api/jobs/recommended)
    const recRes = await fetch(`${BASE_URL}/api/jobs/recommended`, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    assert.strictEqual(recRes.success, true);
    assert.ok(Array.isArray(recRes.data));
    console.log(`✓ 10. Jobs: Recommended Match Feed Passed (${recRes.count} matches ranked)`);

    // 11. AI Project Generation (POST /api/recommendations/generate-project)
    const projRes = await fetch(`${BASE_URL}/api/recommendations/generate-project`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            targetRole: "Full Stack Developer",
            existingSkills: ["React", "Node.js", "MongoDB"],
            missingSkills: ["Docker", "AWS"],
            difficulty: "Intermediate"
        })
    }).then(r => r.json());
    assert.strictEqual(projRes.success, true);
    assert.ok(projRes.data.title);
    assert.ok(projRes.data.databaseSchema);
    console.log("✓ 11. AI Project Blueprint Generator Passed");

    // 12. Save Job (POST /api/saved-jobs) & Get Saved Jobs (GET /api/saved-jobs)
    const saveJobRes = await fetch(`${BASE_URL}/api/saved-jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            jobId: "test_job_101",
            jobDetails: {
                title: "Senior Full Stack Engineer",
                company: "Acme Cloud Inc",
                salary: "$120,000",
                location: "Remote"
            },
            notes: "Applied via referral"
        })
    }).then(r => r.json());
    assert.strictEqual(saveJobRes.success, true);
    console.log("✓ 12. Saved Jobs: POST /api/saved-jobs Passed");

    const getSavedRes = await fetch(`${BASE_URL}/api/saved-jobs`, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    assert.strictEqual(getSavedRes.success, true);
    assert.ok(getSavedRes.data.length >= 1);
    console.log(`✓ 13. Saved Jobs: GET /api/saved-jobs Passed (${getSavedRes.data.length} saved)`);

    // 14. Track Application (POST /api/applications)
    const appRes = await fetch(`${BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            jobId: "test_job_101",
            jobTitle: "Senior Full Stack Engineer",
            company: "Acme Cloud Inc",
            notes: "Interview scheduled"
        })
    }).then(r => r.json());
    assert.strictEqual(appRes.success, true);
    console.log("✓ 14. Applications: POST /api/applications Passed");

    // 15. Delete Skill (DELETE /api/skills/:id)
    const delSkillRes = await fetch(`${BASE_URL}/api/skills/React 19`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    assert.strictEqual(delSkillRes.success, true);
    console.log("✓ 15. Skills: DELETE /api/skills/:id Passed");

    console.log("\n====================================================");
    console.log(" ALL 15 BACKEND & INTEGRATION TESTS PASSED! 🚀      ");
    console.log("====================================================\n");

    if (ephemeralServer) {
        ephemeralServer.close();
    }
    process.exit(0);
}

runBackendTests().catch(err => {
    console.error("Test Suite Failed:", err);
    if (ephemeralServer) {
        ephemeralServer.close();
    }
    process.exit(1);
});
