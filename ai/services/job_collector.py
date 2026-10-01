import httpx
import re
import json
import os
from typing import List, Dict, Any
try:
    from ai.services.skill_service import extract_skills_from_text, normalize_skills
except ImportError:
    from services.skill_service import extract_skills_from_text, normalize_skills

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_JOBS_PATH = os.path.join(BASE_DIR, "data", "raw", "jobs_raw.json")

JOB_SOURCES_METADATA = [
    {
        "provider": "Remotive",
        "apiName": "Remotive Public API",
        "website": "https://remotive.com",
        "free": True,
        "freeTier": True,
        "authenticationRequired": False,
        "rateLimit": "Public access, no API key required",
        "jobDataAvailable": True,
        "status": "Active",
        "badge": "Free / Open"
    },
    {
        "provider": "Arbeitnow",
        "apiName": "Arbeitnow European & Global Jobs API",
        "website": "https://www.arbeitnow.com",
        "free": True,
        "freeTier": True,
        "authenticationRequired": False,
        "rateLimit": "Public access, no key required",
        "jobDataAvailable": True,
        "status": "Active",
        "badge": "Free / Open"
    },
    {
        "provider": "USAJobs",
        "apiName": "USAJobs Open Data API",
        "website": "https://developer.usajobs.gov",
        "free": True,
        "freeTier": True,
        "authenticationRequired": True,
        "rateLimit": "Public developer key required",
        "jobDataAvailable": True,
        "status": "Active",
        "badge": "Free Developer API"
    },
    {
        "provider": "Adzuna",
        "apiName": "Adzuna Job Search API",
        "website": "https://developer.adzuna.com",
        "free": False,
        "freeTier": True,
        "authenticationRequired": True,
        "rateLimit": "250 queries/month free tier limit",
        "jobDataAvailable": True,
        "status": "Key Required",
        "badge": "Free Tier — Limited"
    },
    {
        "provider": "Jooble",
        "apiName": "Jooble Search API",
        "website": "https://jooble.org/api/about",
        "free": False,
        "freeTier": True,
        "authenticationRequired": True,
        "rateLimit": "500 queries/day free tier",
        "jobDataAvailable": True,
        "status": "Key Required",
        "badge": "Free Tier — Limited"
    },
    {
        "provider": "LinkedIn / Indeed",
        "apiName": "Enterprise Partner APIs",
        "website": "https://linkedin.com",
        "free": False,
        "freeTier": False,
        "authenticationRequired": True,
        "rateLimit": "Commercial / Enterprise contract only",
        "jobDataAvailable": False,
        "status": "Paid Enterprise",
        "badge": "Paid / Restricted"
    }
]

def normalize_remote(remote_raw: Any, location_text: str, description: str) -> bool:
    if isinstance(remote_raw, bool):
        return remote_raw
    combined = f"{str(remote_raw)} {location_text} {description}".lower()
    remote_keywords = [
        "remote", "work from home", "wfh", "fully remote", "remote worldwide",
        "anywhere", "telecommute", "distributed team", "100% remote"
    ]
    return any(kw in combined for kw in remote_keywords)

def load_seed_jobs() -> List[Dict[str, Any]]:
    try:
        with open(RAW_JOBS_PATH, "r", encoding="utf-8") as f:
            raw = json.load(f)
            formatted = []
            for item in raw:
                desc = item.get("description", "")
                skills = extract_skills_from_text(desc)
                formatted.append({
                    "id": str(item.get("id")),
                    "title": item.get("title", ""),
                    "company": item.get("company", ""),
                    "location": "Global / Remote",
                    "remote": True,
                    "employmentType": "Full-time",
                    "skills": skills,
                    "description": desc,
                    "salary": "$80,000 - $130,000",
                    "source": "Skill-Centric Seed Base",
                    "jobUrl": "https://remotive.com",
                    "postedAt": "Recent"
                })
            return formatted
    except Exception:
        return []

def deduplicate_jobs(jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = {}
    deduped = []
    
    for job in jobs:
        # Key on normalized title and company
        title_clean = re.sub(r"[^a-zA-Z0-9]", "", job.get("title", "").lower())
        company_clean = re.sub(r"[^a-zA-Z0-9]", "", job.get("company", "").lower())
        key = f"{title_clean}::{company_clean}"
        
        if key not in seen:
            seen[key] = True
            deduped.append(job)
            
    return deduped

def clean_html(raw_html: str) -> str:
    if not raw_html:
        return ""
    cleanr = re.compile(r"<.*?>")
    cleantext = re.sub(cleanr, " ", raw_html)
    return " ".join(cleantext.split())

def fetch_remotive_jobs(limit: int = 25) -> List[Dict[str, Any]]:
    jobs = []
    try:
        url = f"https://remotive.com/api/remote-jobs?limit={limit}"
        response = httpx.get(url, timeout=7.0)
        if response.status_code == 200:
            data = response.json().get("jobs", [])
            for item in data[:limit]:
                desc = clean_html(item.get("description", ""))
                skills = extract_skills_from_text(item.get("title", "") + " " + desc)
                # Also include tags from remotive
                tags = item.get("tags", [])
                if isinstance(tags, list):
                    skills = normalize_skills(skills + tags)
                
                jobs.append({
                    "id": f"remotive-{item.get('id')}",
                    "title": item.get("title", ""),
                    "company": item.get("company_name", ""),
                    "location": item.get("candidate_required_location", "Remote"),
                    "remote": True,
                    "employmentType": item.get("job_type", "Full-time"),
                    "skills": skills[:10],
                    "description": desc[:600] + ("..." if len(desc) > 600 else ""),
                    "salary": item.get("salary", "Competitive"),
                    "source": "Remotive (Free API)",
                    "jobUrl": item.get("url", "https://remotive.com"),
                    "postedAt": item.get("publication_date", "Recent")[:10]
                })
    except Exception as e:
        print(f"Remotive fetch failed (gracefully handled): {e}")
    return jobs

def fetch_arbeitnow_jobs(limit: int = 25) -> List[Dict[str, Any]]:
    jobs = []
    try:
        url = "https://www.arbeitnow.com/api/job-board-api"
        response = httpx.get(url, timeout=7.0)
        if response.status_code == 200:
            data = response.json().get("data", [])
            for item in data[:limit]:
                desc = clean_html(item.get("description", ""))
                skills = extract_skills_from_text(item.get("title", "") + " " + desc)
                tags = item.get("tags", [])
                if isinstance(tags, list):
                    skills = normalize_skills(skills + tags)
                    
                location = item.get("location", "Europe / Remote")
                is_remote = normalize_remote(item.get("remote", False), location, desc)
                
                jobs.append({
                    "id": f"arbeitnow-{item.get('slug', item.get('title'))}",
                    "title": item.get("title", ""),
                    "company": item.get("company_name", ""),
                    "location": location,
                    "remote": is_remote,
                    "employmentType": "Full-time",
                    "skills": skills[:10],
                    "description": desc[:600] + ("..." if len(desc) > 600 else ""),
                    "salary": "Market rate",
                    "source": "Arbeitnow (Free API)",
                    "jobUrl": item.get("url", "https://www.arbeitnow.com"),
                    "postedAt": "Recent"
                })
    except Exception as e:
        print(f"Arbeitnow fetch failed (gracefully handled): {e}")
    return jobs

def get_aggregated_jobs(include_remote_only: bool = False, keyword: str = "") -> List[Dict[str, Any]]:
    all_jobs = []
    
    # 1. Fetch live jobs from free APIs
    remotive = fetch_remotive_jobs(limit=25)
    arbeitnow = fetch_arbeitnow_jobs(limit=25)
    seed = load_seed_jobs()
    
    all_jobs = remotive + arbeitnow + seed
    
    # 2. Deduplicate
    unique_jobs = deduplicate_jobs(all_jobs)
    
    # 3. Filter if requested
    filtered = []
    keyword_lower = keyword.lower().strip()
    
    for job in unique_jobs:
        if include_remote_only and not job.get("remote", False):
            continue
        if keyword_lower:
            text_match = (
                keyword_lower in job.get("title", "").lower() or
                keyword_lower in job.get("company", "").lower() or
                any(keyword_lower in s.lower() for s in job.get("skills", []))
            )
            if not text_match:
                continue
        filtered.append(job)
        
    return filtered
