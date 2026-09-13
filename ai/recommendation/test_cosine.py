from tfidf import compute_tfidf
from cosine_similarity import cosine_similarity


documents = [
    ["Python", "AWS", "Docker"],
    ["Python", "SQL"],
    ["AWS", "Docker"]
]

vocabulary, vectors = compute_tfidf(
    documents
)

print(
    "\n===== COSINE SIMILARITY =====\n"
)

print(
    "Doc1 vs Doc2:",
    cosine_similarity(
        vectors[0],
        vectors[1]
    )
)

print(
    "Doc1 vs Doc3:",
    cosine_similarity(
        vectors[0],
        vectors[2]
    )
)

print(
    "Doc2 vs Doc3:",
    cosine_similarity(
        vectors[1],
        vectors[2]
    )
)

