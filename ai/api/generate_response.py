import json

with open(
    "ai/data/processed/resume_skills.json",
    "r"
) as file:

    skills = json.load(file)

with open(
    "ai/data/processed/recommendations.json",
    "r"
) as file:

    recommendations = json.load(file)

with open(
    "ai/data/processed/learning_paths.json",
    "r"
) as file:

    learning_paths = json.load(file)

with open(
    "ai/data/processed/course_recommendations.json",
    "r"
) as file:

    courses = json.load(file)

response = {
    "skills": skills,
    "top_jobs": recommendations[:5],
    "learning_paths": learning_paths,
    "courses": courses
}

with open(
    "ai/data/processed/final_response.json",
    "w"
) as file:

    json.dump(
        response,
        file,
        indent=4
    )

print(
    "Final AI response generated successfully!"
)