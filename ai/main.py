import os
import sys
from typing import List, Dict, Any, Optional

# Ensure both current directory and parent directory are on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
for path in [CURRENT_DIR, PARENT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

try:
    from ai.services.skill_service import (
        extract_skills_from_text,
        extract_text_from_file,
        normalize_skills,
        normalize_skill,
        categorize_skills
    )
    from ai.services.matching_service import calculate_transparent_match
    from ai.services.job_collector import (
        get_aggregated_jobs,
        JOB_SOURCES_METADATA
    )
    from ai.services.llm_service import analyze_user_skills
    from ai.services.project_generator import generate_custom_project_blueprint
except ImportError:
    from services.skill_service import (
        extract_skills_from_text,
        extract_text_from_file,
        normalize_skills,
        normalize_skill,
        categorize_skills
    )
    from services.matching_service import calculate_transparent_match
    from services.job_collector import (
        get_aggregated_jobs,
        JOB_SOURCES_METADATA
    )
    from services.llm_service import analyze_user_skills
    from services.project_generator import generate_custom_project_blueprint

app = FastAPI(
    title="Skill-Centric AI Service",
    description="Microservice for Resume Parsing, Skill Extraction, Transparent Job Matching, and Project Blueprint Generation",
    version="1.0.0"
)

# Enable CORS for frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class NormalizeSkillsRequest(BaseModel):
    skills: List[str]

class AnalyzeSkillsRequest(BaseModel):
    skills: List[str]
    targetRole: Optional[str] = ""
    resumeText: Optional[str] = ""

class MatchJobsRequest(BaseModel):
    userSkills: Optional[List[str]] = []
    jobs: Optional[List[Dict[str, Any]]] = None
    targetRole: Optional[str] = ""
    preferredRemote: Optional[bool] = False
    experienceLevel: Optional[str] = "Mid"
    customWeights: Optional[Dict[str, float]] = None

class FetchJobsRequest(BaseModel):
    remoteOnly: Optional[bool] = False
    keyword: Optional[str] = ""

class ProjectPlanRequest(BaseModel):
    targetRole: str
    existingSkills: List[str]
    missingSkills: List[str]
    difficulty: Optional[str] = "Intermediate"
    preferredStack: Optional[str] = "Fullstack"
    jobRequirements: Optional[str] = ""

@app.get("/")
def read_root():
    return {
        "service": "Skill-Centric AI Microservice",
        "status": "online",
        "endpoints": [
            "/health",
            "/api/extract-resume",
            "/api/normalize-skills",
            "/api/analyze-skills",
            "/api/job-sources",
            "/api/fetch-jobs",
            "/api/match-jobs",
            "/api/recommend-projects",
            "/api/generate-project-plan"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "skill-centric-ai"}

@app.post("/api/extract-resume")
async def extract_resume(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    extracted_text = ""
    if file:
        content = await file.read()
        extracted_text = extract_text_from_file(content, file.filename)
    elif raw_text:
        extracted_text = raw_text
    else:
        raise HTTPException(status_code=400, detail="Either a resume file or raw_text must be provided")

    detected_skills = extract_skills_from_text(extracted_text)
    normalized = normalize_skills(detected_skills)
    categorized = categorize_skills(normalized)

    return {
        "success": True,
        "extractedTextLength": len(extracted_text),
        "detectedSkills": normalized,
        "categorizedSkills": categorized,
        "totalSkillsFound": len(normalized)
    }

@app.post("/api/normalize-skills")
def normalize_skills_endpoint(req: NormalizeSkillsRequest):
    normalized = normalize_skills(req.skills)
    return {
        "success": True,
        "original": req.skills,
        "normalized": normalized
    }

@app.post("/api/analyze-skills")
def analyze_skills_endpoint(req: AnalyzeSkillsRequest):
    analysis = analyze_user_skills(
        skills=req.skills,
        target_role=req.targetRole or "",
        resume_text=req.resumeText or ""
    )
    return {
        "success": True,
        "data": analysis
    }

@app.get("/api/job-sources")
def get_job_sources():
    return {
        "success": True,
        "data": JOB_SOURCES_METADATA
    }

@app.post("/api/fetch-jobs")
def fetch_jobs_endpoint(req: FetchJobsRequest):
    jobs = get_aggregated_jobs(
        include_remote_only=req.remoteOnly,
        keyword=req.keyword
    )
    return {
        "success": True,
        "count": len(jobs),
        "data": jobs
    }

@app.post("/api/match-jobs")
def match_jobs_endpoint(req: MatchJobsRequest):
    # If jobs not provided in request, fetch aggregated
    jobs_to_match = req.jobs
    if not jobs_to_match:
        jobs_to_match = get_aggregated_jobs(include_remote_only=req.preferredRemote)

    ranked_jobs = []
    for job in jobs_to_match:
        match_result = calculate_transparent_match(
            user_skills=req.userSkills,
            job=job,
            target_role=req.targetRole or "",
            preferred_remote=req.preferredRemote or False,
            user_experience_level=req.experienceLevel or "Mid",
            custom_weights=req.customWeights
        )
        ranked_jobs.append({
            **job,
            **match_result
        })

    # Sort descending by match percentage
    ranked_jobs.sort(key=lambda x: x.get("matchPercentage", 0), reverse=True)

    return {
        "success": True,
        "count": len(ranked_jobs),
        "data": ranked_jobs
    }

@app.post("/api/recommend-projects")
def recommend_projects_endpoint(req: AnalyzeSkillsRequest):
    analysis = analyze_user_skills(
        skills=req.skills,
        target_role=req.targetRole or ""
    )
    return {
        "success": True,
        "data": analysis.get("recommended_projects", [])
    }

@app.post("/api/generate-project-plan")
def generate_project_plan_endpoint(req: ProjectPlanRequest):
    blueprint = generate_custom_project_blueprint(
        target_role=req.targetRole,
        existing_skills=req.existingSkills,
        missing_skills=req.missingSkills,
        difficulty=req.difficulty or "Intermediate",
        preferred_stack=req.preferredStack or "Fullstack",
        job_requirements=req.jobRequirements or ""
    )
    return {
        "success": True,
        "data": blueprint
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("ai.main:app", host=host, port=port, reload=True)
