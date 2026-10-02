import json

with open(
    "ai/data/processed/recommendations.json",
    "r"
) as file:

    recommendations = json.load(file)

with open(
    "ai/data/skills/roadmap_templates.json",
    "r"
) as file:

    roadmap_templates = json.load(file)

all_missing_skills = set()

for job in recommendations:

    for skill in job["missing_skills"]:

        all_missing_skills.add(skill)

learning_paths = {}

for skill in all_missing_skills:

    if skill in roadmap_templates:

        learning_paths[skill] = roadmap_templates[skill]

    else:

        learning_paths[skill] = [
            f"Learn {skill} Basics",
            f"Practice {skill} Projects",
            f"Build a Mini Project using {skill}"
        ]

with open(
    "ai/data/processed/learning_paths.json",
    "w"
) as file:

    json.dump(
        learning_paths,
        file,
        indent=4
    )

print(
    "Learning paths generated successfully!"
)