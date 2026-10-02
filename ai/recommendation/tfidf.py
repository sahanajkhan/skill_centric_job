from collections import Counter
import math


def compute_tfidf(documents):

    vocabulary = set()

    for doc in documents:
        vocabulary.update(doc)

    vocabulary = sorted(vocabulary)

    tfidf_vectors = []

    N = len(documents)

    for doc in documents:

        tf = Counter(doc)

        vector = []

        for term in vocabulary:

            term_freq = tf[term]

            doc_freq = sum(
                1
                for d in documents
                if term in d
            )

            idf = math.log(
    (N + 1) / (doc_freq + 1)
) + 1

            vector.append(
                term_freq * idf
            )

        tfidf_vectors.append(vector)

    return vocabulary, tfidf_vectors