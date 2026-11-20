def jaccard_similarity(text1, text2):

    set1 = set(text1.lower().split())
    set2 = set(text2.lower().split())

    intersection = set1.intersection(set2)
    union = set1.union(set2)

    return len(intersection) / len(union)


if __name__ == "__main__":

    job1 = "Python Backend Developer"
    job2 = "Backend Python Developer"

    score = jaccard_similarity(
        job1,
        job2
    )

    print(score)