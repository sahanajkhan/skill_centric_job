import json

with open(
    "ai/data/raw/jobs_raw.json",
    "r"
) as file:

    jobs = json.load(file)

assert len(jobs) > 0

print(
    f"PASS: {len(jobs)} jobs loaded"
)