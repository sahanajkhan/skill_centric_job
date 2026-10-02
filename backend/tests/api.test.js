const assert = require("assert");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000";

async function runBackendTests() {
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
    console.log("✓ 2. API Sources Registry Passed (Free & Open APIs Verified)");

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

    // 12. Delete Skill (DELETE /api/skills/:id)
    const delSkillRes = await fetch(`${BASE_URL}/api/skills/React 19`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    assert.strictEqual(delSkillRes.success, true);
    console.log("✓ 12. Skills: DELETE /api/skills/:id Passed");

    console.log("\n====================================================");
    console.log(" ALL BACKEND & INTEGRATION TESTS PASSED SUCCESSFULLY! 🚀 ");
    console.log("====================================================\n");
}

runBackendTests().catch(err => {
    console.error("Test Suite Failed:", err);
    process.exit(1);
});
