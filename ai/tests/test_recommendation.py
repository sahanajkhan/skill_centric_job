import sys
import os

sys.path.append(
    os.path.abspath("ai")
)

from recommendation.scoring import (
    calculate_match_score
)

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

score, matching, missing = (
    calculate_match_score(
        user_skills,
        job_skills
    )
)

assert score > 0
assert "Python" in matching
assert "SQL" in missing

print(
    f"PASS: Recommendation score = {score}%"
)