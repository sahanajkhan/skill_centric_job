def calculate_match_score(
    user_skills,
    job_skills
):

    user_skills = set(user_skills)
    job_skills = set(job_skills)

    matching_skills = list(
        user_skills.intersection(job_skills)
    )

    missing_skills = list(
        job_skills - user_skills
    )

    score = (
        len(matching_skills)
        / len(job_skills)
    ) * 100

    return (
        round(score, 2),
        matching_skills,
        missing_skills
    )