from scoring import calculate_match_score

user_skills = [
    "Python",
    "AWS",
    "Docker"
]

job_skills = [
    "Python",
    "AWS",
    "Docker",
    "SQL"
]

score, matching = calculate_match_score(
    user_skills,
    job_skills
)

print("Match Score:", score)
print("Matching Skills:", matching)