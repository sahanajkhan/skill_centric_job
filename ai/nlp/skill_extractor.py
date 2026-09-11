import json
import re

def load_aliases(alias_file):

    with open(alias_file, "r") as file:
        aliases = json.load(file)

    return aliases

def load_skills(skill_file):
    with open(skill_file, "r") as file:
        skills_data = json.load(file)

    all_skills = []

    for category in skills_data.values():
        all_skills.extend(category)

    return all_skills


def extract_skills(
    text,
    skills_list,
    aliases
):
    found_skills = []

    text = text.lower()

    # Exact skill matching
    for skill in skills_list:

        pattern = r'\b' + re.escape(skill.lower()) + r'\b'

        if re.search(pattern, text):
            found_skills.append(skill)

    # Alias matching
    for skill, alias_list in aliases.items():

        for alias in alias_list:

            pattern = r'\b' + re.escape(alias.lower()) + r'\b'

            if re.search(pattern, text):

                if skill not in found_skills:
                    found_skills.append(skill)

    return found_skills

def extract_skills_from_jobs(
    jobs,
    skills_list,
    aliases
):
    processed_jobs = []

    for job in jobs:

        extracted_skills = extract_skills(
            job["description"],
            skills_list,
            aliases
        )

        processed_jobs.append({
            "id": job["id"],
            "title": job["title"],
            "company": job["company"],
            "skills": extracted_skills
        })

    return processed_jobs

if __name__ == "__main__":

    skills = load_skills(
        "ai/data/skills/skill_taxonomy.json"
    )

    aliases = load_aliases(
    "ai/data/skills/skill_aliases.json"
)

    with open(
        "ai/data/raw/jobs_raw.json",
        "r"
    ) as file:
        jobs = json.load(file)

    processed_jobs = extract_skills_from_jobs(
        jobs,
        skills,
        aliases
    )

    with open(
        "ai/data/processed/jobs_processed.json",
        "w"
    ) as file:
        json.dump(
            processed_jobs,
            file,
            indent=4
        )

    print("Processed jobs saved successfully!")