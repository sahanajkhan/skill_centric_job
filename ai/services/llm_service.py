import os
import json
import httpx
from typing import List, Dict, Any
try:
    from ai.services.skill_service import TAXONOMY, normalize_skills
except ImportError:
    from services.skill_service import TAXONOMY, normalize_skills

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

ROLE_PROFILES = {
    "Full Stack Developer": {
        "core": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "HTML5", "CSS3", "RESTful APIs"],
        "recommended": ["TypeScript", "Docker", "Tailwind CSS", "PostgreSQL", "Next.js", "CI/CD"]
    },
    "Frontend Developer": {
        "core": ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
        "recommended": ["Next.js", "Redux", "GraphQL", "Three.js", "Testing"]
    },
    "Backend Developer": {
        "core": ["Node.js", "Python", "Express", "FastAPI", "MongoDB", "PostgreSQL", "SQL"],
        "recommended": ["Docker", "Redis", "Kubernetes", "AWS", "CI/CD", "Kafka"]
    },
    "AI / Machine Learning Engineer": {
        "core": ["Python", "Machine Learning", "Scikit-Learn", "Pandas", "NumPy"],
        "recommended": ["PyTorch", "TensorFlow", "NLP", "LLM", "Deep Learning", "Docker"]
    },
    "DevOps & Cloud Engineer": {
        "core": ["Linux", "Docker", "Git", "CI/CD", "AWS"],
        "recommended": ["Kubernetes", "Terraform", "Ansible", "Prometheus", "Grafana"]
    }
}

def analyze_user_skills(
    skills: List[str],
    target_role: str = "",
    resume_text: str = ""
) -> Dict[str, Any]:
    norm_skills = normalize_skills(skills)
    skill_lower_map = {s.lower(): s for s in norm_skills}
    
    # 1. Determine role matches
    role_scores = {}
    for role, profile in ROLE_PROFILES.items():
        core_set = {s.lower() for s in profile["core"]}
        overlap = len([s for s in skill_lower_map if s in core_set])
        role_scores[role] = overlap / len(core_set) if core_set else 0
        
    sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
    best_role = target_role if target_role else (sorted_roles[0][0] if sorted_roles else "Full Stack Developer")
    recommended_roles = [r[0] for r in sorted_roles[:3]]
    
    # 2. Strong vs Intermediate vs Beginner
    strong_skills = []
    intermediate_skills = []
    beginner_skills = []
    
    for i, s in enumerate(norm_skills):
        # Heuristic: Earlier detected or core skills treated as primary
        if i < len(norm_skills) // 3:
            strong_skills.append(s)
        elif i < (2 * len(norm_skills)) // 3:
            intermediate_skills.append(s)
        else:
            beginner_skills.append(s)
            
    if not strong_skills and norm_skills:
        strong_skills = norm_skills[:2]
        intermediate_skills = norm_skills[2:]

    # 3. Missing skills for target/best role
    target_profile = ROLE_PROFILES.get(best_role, ROLE_PROFILES["Full Stack Developer"])
    target_expectations = target_profile["core"] + target_profile["recommended"]
    
    missing_skills = []
    for exp_skill in target_expectations:
        if exp_skill.lower() not in skill_lower_map:
            missing_skills.append(exp_skill)
            
    # 4. Tailored portfolio project recommendations
    project_suggestions = []
    if "React" in norm_skills or "JavaScript" in norm_skills:
        project_suggestions.append({
            "title": f"Skill-Driven {best_role} Dashboard",
            "skillsUsed": [s for s in ["React", "Tailwind CSS", "JavaScript"] if s in norm_skills],
            "skillsToLearn": [s for s in ["TypeScript", "Docker"] if s not in norm_skills],
            "difficulty": "Intermediate"
        })
    if "Python" in norm_skills or "FastAPI" in norm_skills:
        project_suggestions.append({
            "title": "Automated Resume & Skill Gap Analyzer Engine",
            "skillsUsed": [s for s in ["Python", "FastAPI", "NLP"] if s in norm_skills],
            "skillsToLearn": [s for s in ["Scikit-Learn", "Docker"] if s not in norm_skills],
            "difficulty": "Advanced"
        })
    if not project_suggestions:
        project_suggestions.append({
            "title": f"Production {best_role} Portfolio Platform",
            "skillsUsed": norm_skills[:3],
            "skillsToLearn": missing_skills[:2],
            "difficulty": "Intermediate"
        })

    return {
        "skills": norm_skills,
        "strong_skills": strong_skills,
        "intermediate_skills": intermediate_skills,
        "beginner_skills": beginner_skills,
        "missing_skills": missing_skills[:6],
        "recommended_roles": recommended_roles,
        "recommended_projects": project_suggestions
    }
