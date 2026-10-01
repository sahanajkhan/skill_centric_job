const assert = require("assert");

const BASE_URL = "http://localhost:5000";

async function runBackendTests() {
    console.log("Starting Backend & Integration Verification Suite...");

    // 1. Health Probe
    const healthRes = await fetch(`${BASE_URL}/api/health`).then(r => r.json());
    assert.strictEqual(healthRes.success, true);
    assert.strictEqual(healthRes.services.backend, "healthy");
    assert.strictEqual(healthRes.services.ai_microservice.status, "healthy");
    console.log("✓ Health Check Passed (Backend + AI microservice connected)");

    // 2. Job Sources Transparency
    const sourcesRes = await fetch(`${BASE_URL}/api/jobs/sources`).then(r => r.json());
    assert.strictEqual(sourcesRes.success, true);
    assert.ok(sourcesRes.data.length >= 2);
    const remotive = sourcesRes.data.find(s => s.provider === "Remotive");
    assert.strictEqual(remotive.free, true);
    console.log("✓ API Sources Registry Passed (Free & Open APIs Verified)");

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
    console.log("✓ Authentication & JWT Generation Passed");

    // 4. Add Skills with Normalization
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
    console.log("✓ Skill Addition & Auto-Normalization Passed (ReactJS -> React)");

    // 5. Get Personalized AI Feed
    const feedRes = await fetch(`${BASE_URL}/api/jobs/feed`, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());
    console.log("feedRes status:", feedRes.success, feedRes.count, feedRes.message);
    assert.strictEqual(feedRes.success, true);
    assert.ok(Array.isArray(feedRes.data));
    console.log(`✓ Personalized Match Feed Passed (${feedRes.count} matching opportunities evaluated)`);

    // 6. AI Project Generation
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
    console.log("✓ AI Project Builder Passed (Complete Architecture & Roadmap Generated)");

    console.log("\nALL BACKEND & INTEGRATION TESTS PASSED SUCCESSFULLY! 🚀");
}

runBackendTests().catch(err => {
    console.error("Test Suite Failed:", err);
    process.exit(1);
});
