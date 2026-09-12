import json
from collections import Counter
from scoring import calculate_match_score


user_skills = [
    "Python",
    "AWS",
    "Docker"
]


with open(
    "ai/data/processed/jobs_processed.json",
    "r"
) as file:

    jobs = json.load(file)


recommendations = []

for job in jobs:

   score, matching, missing = calculate_match_score(
    user_skills,
    job["skills"]
)

   recommendations.append({
    "title": job["title"],
    "company": job["company"],
    "score": score,
    "matching_skills": matching,
    "missing_skills": missing
})


recommendations.sort(
    key=lambda x: x["score"],
    reverse=True
)


print("\n===== TOP JOB RECOMMENDATIONS =====\n")

for rec in recommendations[:5]:

    print(
        f"{rec['title']} | "
        f"{rec['company']} | "
        f"Score: {rec['score']}%"
    )

    print(
        f"Matching Skills: "
        f"{', '.join(rec['matching_skills'])}"
    )

    print(
    f"Missing Skills: "
    f"{', '.join(rec['missing_skills'])}"
)

    print("-" * 50)

    all_missing_skills = []

for rec in recommendations:

    all_missing_skills.extend(
        rec["missing_skills"]
    )

skill_counts = Counter(
    all_missing_skills
)

print(
    "\n===== TOP SKILLS TO LEARN =====\n"
)

for skill, count in skill_counts.most_common(5):

    print(
        f"{skill}: {count}"
    )
