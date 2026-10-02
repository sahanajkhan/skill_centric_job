import json
import os
import re
from typing import List, Dict, Tuple
import pdfplumber
import io

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAXONOMY_PATH = os.path.join(BASE_DIR, "data", "skills", "skill_taxonomy.json")
ALIASES_PATH = os.path.join(BASE_DIR, "data", "skills", "skill_aliases.json")

def load_taxonomy() -> Dict[str, List[str]]:
    try:
        with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {
            "programming_languages": ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "C#"],
            "frameworks": ["React", "Node.js", "Express", "FastAPI", "Django", "Spring Boot", "Next.js"],
            "databases": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "SQL"],
            "cloud": ["AWS", "Azure", "GCP"],
            "tools": ["Git", "Docker", "Kubernetes", "Linux", "CI/CD"],
            "ai_ml": ["Machine Learning", "Deep Learning", "NLP", "LLM", "PyTorch", "TensorFlow", "Scikit-Learn"]
        }

def load_aliases() -> Dict[str, List[str]]:
    try:
        with open(ALIASES_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {
            "React": ["React", "ReactJS", "React.js"],
            "Node.js": ["Node.js", "Node", "NodeJS"],
            "MongoDB": ["MongoDB", "Mongo"],
            "JavaScript": ["JavaScript", "JS"],
            "TypeScript": ["TypeScript", "TS"],
            "PostgreSQL": ["PostgreSQL", "Postgres"]
        }

TAXONOMY = load_taxonomy()
ALIASES = load_aliases()

# Build inverse lookup for quick normalization
ALIAS_TO_CANONICAL: Dict[str, str] = {}
for canonical, variants in ALIASES.items():
    ALIAS_TO_CANONICAL[canonical.lower()] = canonical
    for variant in variants:
        ALIAS_TO_CANONICAL[variant.lower()] = canonical

# Also add all taxonomy skills as canonical
ALL_CANONICAL_SKILLS = set()
for category, skills in TAXONOMY.items():
    for s in skills:
        ALL_CANONICAL_SKILLS.add(s)
        if s.lower() not in ALIAS_TO_CANONICAL:
            ALIAS_TO_CANONICAL[s.lower()] = s

def normalize_skill(skill_name: str) -> str:
    cleaned = skill_name.strip()
    if not cleaned:
        return ""
    lower = cleaned.lower()
    if lower in ALIAS_TO_CANONICAL:
        return ALIAS_TO_CANONICAL[lower]
    # Check if any canonical skill is contained or matches title case
    for canonical in ALL_CANONICAL_SKILLS:
        if canonical.lower() == lower:
            return canonical
    return cleaned

def normalize_skills(skill_list: List[str]) -> List[str]:
    seen = set()
    result = []
    for s in skill_list:
        norm = normalize_skill(s)
        if norm and norm.lower() not in seen:
            seen.add(norm.lower())
            result.append(norm)
    return result

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    lower_fn = filename.lower()
    text = ""
    if lower_fn.endswith(".pdf"):
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            text = ""
    else:
        # Plain text, markdown, docx fallback
        for encoding in ["utf-8", "latin-1", "cp1252"]:
            try:
                text = file_bytes.decode(encoding)
                break
            except UnicodeDecodeError:
                continue
    return text

def extract_skills_from_text(text: str) -> List[str]:
    if not text:
        return []
    
    found_skills = set()
    text_lower = " " + text.lower() + " "
    
    # Check aliases first
    for variant_lower, canonical in ALIAS_TO_CANONICAL.items():
        pattern = r"(?<![a-zA-Z0-9_#+])" + re.escape(variant_lower) + r"(?![a-zA-Z0-9_#+])"
        if re.search(pattern, text_lower):
            found_skills.add(canonical)
            
    # Check canonical taxonomy
    for canonical in ALL_CANONICAL_SKILLS:
        pattern = r"(?<![a-zA-Z0-9_#+])" + re.escape(canonical.lower()) + r"(?![a-zA-Z0-9_#+])"
        if re.search(pattern, text_lower):
            found_skills.add(canonical)
            
    return sorted(list(found_skills))

def categorize_skills(skills: List[str]) -> Dict[str, List[str]]:
    categorized = {}
    remaining = []
    
    for category, cat_skills in TAXONOMY.items():
        cat_set = {s.lower() for s in cat_skills}
        matching = [s for s in skills if s.lower() in cat_set or normalize_skill(s).lower() in cat_set]
        if matching:
            categorized[category] = matching
            
    # Track any unclassified skills
    all_known = {s.lower() for cat in TAXONOMY.values() for s in cat}
    for s in skills:
        if s.lower() not in all_known and normalize_skill(s).lower() not in all_known:
            remaining.append(s)
            
    if remaining:
        categorized["other"] = remaining
        
    return categorized
