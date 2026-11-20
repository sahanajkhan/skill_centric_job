import json
import re

from resume_reader import extract_text_from_pdf


def load_skills():

    with open(
        "ai/data/skills/skill_taxonomy.json",
        "r"
    ) as file:

        skills_data = json.load(file)

    skills = []

    for category in skills_data.values():

        skills.extend(category)

    return skills


def extract_resume_skills(
    resume_text,
    skills_list
):

    found_skills = []

    resume_text = resume_text.lower()

    for skill in skills_list:

        pattern = (
            r"\b"
            + re.escape(skill.lower())
            + r"\b"
        )

        if re.search(
            pattern,
            resume_text
        ):

            found_skills.append(skill)

    return list(dict.fromkeys(found_skills))


if __name__ == "__main__":

    resume_text = extract_text_from_pdf(
        "Riya Bansal Resume.pdf"
    )

    skills = load_skills()

    extracted_skills = (
        extract_resume_skills(
            resume_text,
            skills
        )
    )

    print(
        "\n===== RESUME SKILLS =====\n"
    )

for skill in extracted_skills:

    print(skill)

with open(
    "ai/data/processed/resume_skills.json",
    "w"
) as file:

    json.dump(
        extracted_skills,
        file,
        indent=4
    )

print(
    "\nSkills saved successfully!"
)
