import json

from scoring import calculate_match_score


user_skills = [
    "Python",
    "AWS",
    "Docker"
]


with open(
    "../data/processed/jobs_processed.json",
    "r"
) as file:

    jobs = json.load(file)


recommendations = []

for job in jobs:

    score, matching = calculate_match_score(
        user_skills,
        job["skills"]
    )

    recommendations.append({
        "title": job["title"],
        "company": job["company"],
        "score": score,
        "matching_skills": matching
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

    print("-" * 50)
