import json

from normalize import normalize_text
from jaccard import jaccard_similarity
from fuzzy_match import fuzzy_similarity


def remove_duplicates(jobs):

    unique_jobs = []

    for job in jobs:

        is_duplicate = False

        current_title = normalize_text(
            job["title"]
        )

        for existing_job in unique_jobs:

            existing_title = normalize_text(
                existing_job["title"]
            )

            jaccard_score = jaccard_similarity(
                current_title,
                existing_title
            )

            fuzzy_score = fuzzy_similarity(
                current_title,
                existing_title
            )

            if (
                jaccard_score >= 0.8
                or
                fuzzy_score >= 0.9
            ):
                is_duplicate = True
                break

        if not is_duplicate:
            unique_jobs.append(job)

    return unique_jobs


if __name__ == "__main__":

    with open(
        "ai/data/raw/jobs_raw.json",
        "r"
    ) as file:
        jobs = json.load(file)

    unique_jobs = remove_duplicates(
        jobs
    )

    with open(
        "ai/data/processed/jobs_deduplicated.json",
        "w"
    ) as file:

        json.dump(
            unique_jobs,
            file,
            indent=4
        )

    print(
        f"Original Jobs: {len(jobs)}"
    )

    print(
        f"Unique Jobs: {len(unique_jobs)}"
    )

    print(
        "Deduplicated jobs saved successfully!"
    )