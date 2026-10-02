import json

with open(
    "ai/data/processed/jobs_processed.json",
    "r"
) as file:

    jobs = json.load(file)

assert len(jobs) > 0

for job in jobs:

    assert "skills" in job

    assert isinstance(
        job["skills"],
        list
    )

print(
    f"PASS: {len(jobs)} jobs contain extracted skills"
)