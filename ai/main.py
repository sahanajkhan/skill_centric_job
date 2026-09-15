from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="AI Recommendations API")

# Allow requests from backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_json(filepath):
    # Determine absolute path relative to this script just in case
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_path = os.path.join(base_dir, filepath)
    try:
        with open(full_path, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

@app.get("/api/recommendations")
def get_recommendations():
    skills = load_json("data/processed/resume_skills.json")
    recommendations = load_json("data/processed/recommendations.json")
    learning_paths = load_json("data/processed/learning_paths.json")
    courses = load_json("data/processed/course_recommendations.json")
    
    response = {
        "skills": skills,
        "top_jobs": recommendations[:5] if recommendations else [],
        "learning_paths": learning_paths,
        "courses": courses
    }
    return response

@app.get("/health")
def health_check():
    return {"status": "healthy"}
