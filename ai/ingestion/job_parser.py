import json


with open(
    "ai/data/raw/jobs_raw.json",
    "r"
) as file:

    jobs = json.load(file)


for job in jobs:

    print("\nJob Title:", job["title"])
    print("Company:", job["company"])
    print("Description:", job["description"])