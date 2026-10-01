import re
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
try:
    from ai.services.skill_service import normalize_skill, normalize_skills
except ImportError:
    from services.skill_service import normalize_skill, normalize_skills

DEFAULT_WEIGHTS = {
    "skill_match": 0.50,
    "role_match": 0.20,
    "experience_match": 0.10,
    "location_remote_match": 0.10,
    "tech_category_match": 0.10
}

def calculate_transparent_match(
    user_skills: List[str],
    job: Dict[str, Any],
    target_role: str = "",
    preferred_remote: bool = False,
    user_experience_level: str = "Mid",
    custom_weights: Dict[str, float] = None
) -> Dict[str, Any]:
    weights = {**DEFAULT_WEIGHTS, **(custom_weights or {})}
    
    # 1. Normalize skills
    norm_user_skills = normalize_skills(user_skills)
    raw_job_skills = job.get("skills", [])
    if isinstance(raw_job_skills, str):
        raw_job_skills = [s.strip() for s in raw_job_skills.split(",") if s.strip()]
    norm_job_skills = normalize_skills(raw_job_skills)
    
    user_skill_set = {s.lower(): s for s in norm_user_skills}
    job_skill_set = {s.lower(): s for s in norm_job_skills}
    
    # Matched & Missing skills
    matched_skills = []
    missing_skills = []
    
    for lower_s, original in job_skill_set.items():
        if lower_s in user_skill_set:
            matched_skills.append(original)
        else:
            missing_skills.append(original)
            
    # Skill overlap score
    if job_skill_set:
        skill_score = (len(matched_skills) / len(job_skill_set)) * 100
    else:
        skill_score = 50.0  # neutral if job has no explicit skills listed
        
    # TF-IDF cosine boost
    if norm_user_skills and norm_job_skills:
        try:
            user_doc = " ".join(norm_user_skills)
            job_doc = " ".join(norm_job_skills) + " " + job.get("title", "")
            vectorizer = TfidfVectorizer()
            tfidf_mat = vectorizer.fit_transform([user_doc, job_doc])
            cosine_score = float(cosine_similarity(tfidf_mat[0:1], tfidf_mat[1:2])[0][0]) * 100
            # Blend set overlap (70%) with TF-IDF cosine similarity (30%)
            skill_score = (0.7 * skill_score) + (0.3 * cosine_score)
        except Exception:
            pass
            
    skill_score = min(max(skill_score, 0), 100)
    
    # 2. Role Match
    job_title = job.get("title", "").lower()
    role_score = 60.0  # baseline
    matching_reasons = []
    
    if target_role:
        target_lower = target_role.lower()
        target_tokens = set(re.findall(r"\w+", target_lower))
        title_tokens = set(re.findall(r"\w+", job_title))
        
        common_tokens = target_tokens.intersection(title_tokens)
        if target_lower in job_title or job_title in target_lower:
            role_score = 100.0
            matching_reasons.append(f"Title perfectly matches your target role '{target_role}'")
        elif common_tokens:
            role_score = 75.0 + (len(common_tokens) * 8.0)
            matching_reasons.append(f"Shares keywords with target role: {', '.join(common_tokens)}")
        else:
            role_score = 40.0
    else:
        role_score = 70.0
    role_score = min(max(role_score, 0), 100)
    
    # 3. Remote / Location Match
    job_remote = bool(job.get("remote", False))
    location_score = 50.0
    if preferred_remote:
        if job_remote:
            location_score = 100.0
            matching_reasons.append("Matches your remote work preference")
        else:
            location_score = 25.0
    else:
        location_score = 90.0 if job_remote else 80.0
        
    # 4. Experience Match
    job_exp = (job.get("experience", "") or job.get("description", "")).lower()
    exp_score = 75.0
    if "senior" in job_title or "lead" in job_title:
        if user_experience_level.lower() in ["senior", "lead"]:
            exp_score = 100.0
            matching_reasons.append("Matches senior career level")
        else:
            exp_score = 50.0
    elif "junior" in job_title or "entry" in job_title or "intern" in job_title:
        if user_experience_level.lower() in ["junior", "entry", "student"]:
            exp_score = 100.0
            matching_reasons.append("Ideal for entry level or junior profile")
        else:
            exp_score = 70.0
    else:
        exp_score = 85.0
        
    # 5. Technology match
    tech_score = skill_score
    if matched_skills:
        matching_reasons.append(f"Verified matching core skills: {', '.join(matched_skills[:4])}")
    if missing_skills:
        matching_reasons.append(f"Growth opportunity to learn: {', '.join(missing_skills[:3])}")

    # Total weighted score
    final_score = (
        (skill_score * weights["skill_match"]) +
        (role_score * weights["role_match"]) +
        (exp_score * weights["experience_match"]) +
        (location_score * weights["location_remote_match"]) +
        (tech_score * weights["tech_category_match"])
    )
    final_percentage = round(min(max(final_score, 5.0), 98.0), 1)

    return {
        "matchPercentage": final_percentage,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "matchingReasons": matching_reasons,
        "skillGap": missing_skills,
        "scoreBreakdown": {
            "skillScore": round(skill_score, 1),
            "roleScore": round(role_score, 1),
            "experienceScore": round(exp_score, 1),
            "locationScore": round(location_score, 1)
        }
    }
