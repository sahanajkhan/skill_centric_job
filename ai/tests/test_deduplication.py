import json

with open(
    "ai/data/processed/jobs_deduplicated.json",
    "r"
) as file:

    jobs = json.load(file)

titles = [
    job["title"]
    for job in jobs
]

assert len(titles) == len(set(titles))

print(
    f"PASS: {len(jobs)} unique jobs found"
)