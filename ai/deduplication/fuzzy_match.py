from difflib import SequenceMatcher


def fuzzy_similarity(text1, text2):

    return SequenceMatcher(
        None,
        text1.lower(),
        text2.lower()
    ).ratio()


if __name__ == "__main__":

    job1 = "Python Developer"
    job2 = "Python Devloper"

    score = fuzzy_similarity(
        job1,
        job2
    )

    print(score)