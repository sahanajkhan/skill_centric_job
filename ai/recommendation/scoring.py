from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_match_score(
    user_skills,
    job_skills
):

    user_text = " ".join(user_skills)
    job_text = " ".join(job_skills)

    documents = [
        user_text,
        job_text
    ]

    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform(
        documents
    )

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    matching_skills = list(
        set(user_skills).intersection(
            set(job_skills)
        )
    )

    missing_skills = list(
        set(job_skills) - set(user_skills)
    )

    score = round(
        similarity * 100,
        2
    )

    return (
        score,
        matching_skills,
        missing_skills
    )