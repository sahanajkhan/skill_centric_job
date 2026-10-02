import json

with open(
    "ai/data/processed/learning_paths.json",
    "r"
) as file:

    learning_paths = json.load(file)

with open(
    "ai/data/skills/course_templates.json",
    "r"
) as file:

    course_templates = json.load(file)

course_recommendations = {}

for skill in learning_paths:

    if skill in course_templates:

        course_recommendations[skill] = {
            "roadmap": learning_paths[skill],
            "courses": course_templates[skill]
        }

    else:

        course_recommendations[skill] = {
            "roadmap": learning_paths[skill],
            "courses": [
                f"{skill} Official Documentation",
                f"{skill} Beginner Course",
                f"{skill} Project Tutorial"
            ]
        }

with open(
    "ai/data/processed/course_recommendations.json",
    "w"
) as file:

    json.dump(
        course_recommendations,
        file,
        indent=4
    )

print(
    "Course recommendations generated successfully!"
)