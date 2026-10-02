import unittest
import os
import sys

# Ensure root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ai.services.skill_service import normalize_skill, normalize_skills, extract_skills_from_text, categorize_skills
from ai.services.matching_service import calculate_transparent_match
from ai.services.job_collector import deduplicate_jobs, JOB_SOURCES_METADATA
from ai.services.project_generator import generate_custom_project_blueprint
from ai.services.llm_service import analyze_user_skills

class TestAIServiceSuite(unittest.TestCase):

    def test_skill_normalization(self):
        self.assertEqual(normalize_skill("ReactJS"), "React")
        self.assertEqual(normalize_skill("Node"), "Node.js")
        self.assertEqual(normalize_skill("Mongo"), "MongoDB")
        self.assertEqual(normalize_skill("JS"), "JavaScript")
        self.assertEqual(normalize_skill("TS"), "TypeScript")
        self.assertEqual(normalize_skill("Postgres"), "PostgreSQL")

    def test_skill_extraction_from_text(self):
        sample_text = "Looking for a Senior Engineer with deep experience in React, Node.js, Docker, and AWS."
        extracted = extract_skills_from_text(sample_text)
        self.assertIn("React", extracted)
        self.assertIn("Node.js", extracted)
        self.assertIn("Docker", extracted)
        self.assertIn("AWS", extracted)

    def test_transparent_matching(self):
        user_skills = ["React", "Node.js", "MongoDB", "JavaScript"]
        job = {
            "title": "Full Stack React & Node Developer",
            "company": "Tech Corp",
            "location": "Remote",
            "remote": True,
            "skills": ["React", "Node.js", "MongoDB", "AWS", "Docker"]
        }
        res = calculate_transparent_match(user_skills, job, target_role="Full Stack Developer", preferred_remote=True)
        self.assertGreater(res["matchPercentage"], 50)
        self.assertIn("React", res["matchedSkills"])
        self.assertIn("Node.js", res["matchedSkills"])
        self.assertIn("AWS", res["missingSkills"])
        self.assertGreater(len(res["matchingReasons"]), 0)

    def test_job_deduplication(self):
        jobs = [
            {"title": "Software Engineer", "company": "Google", "location": "Remote"},
            {"title": "Software Engineer", "company": "Google", "location": "USA"},
            {"title": "Backend Developer", "company": "Amazon", "location": "Remote"}
        ]
        deduped = deduplicate_jobs(jobs)
        self.assertEqual(len(deduped), 2)

    def test_job_sources_metadata(self):
        remotive = next((s for s in JOB_SOURCES_METADATA if s["provider"] == "Remotive"), None)
        self.assertIsNotNone(remotive)
        self.assertTrue(remotive["free"])
        self.assertFalse(remotive["authenticationRequired"])

    def test_project_blueprint_generator(self):
        blueprint = generate_custom_project_blueprint(
            target_role="Full Stack Developer",
            existing_skills=["React", "Node.js"],
            missing_skills=["Docker", "AWS"],
            difficulty="Intermediate"
        )
        self.assertIn("title", blueprint)
        self.assertIn("databaseSchema", blueprint)
        self.assertIn("apiDesign", blueprint)
        self.assertIn("folderStructure", blueprint)
        self.assertGreater(len(blueprint["implementationPlan"]), 0)

if __name__ == "__main__":
    unittest.main()
