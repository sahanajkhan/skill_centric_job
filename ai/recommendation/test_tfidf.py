from tfidf import compute_tfidf


documents = [
    ["Python", "AWS", "Docker"],
    ["Python", "SQL"],
    ["AWS", "Docker"]
]

vocabulary, vectors = compute_tfidf(
    documents
)

print(
    "\n===== VOCABULARY =====\n"
)

print(vocabulary)

print(
    "\n===== TF-IDF VECTORS =====\n"
)

for vector in vectors:
    print(vector)