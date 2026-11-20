import re

def normalize_text(text):

    text = text.lower()

    text = text.strip()

    text = re.sub(r'\s+', ' ', text)

    return text


if __name__ == "__main__":

    sample = "   Python    Developer   "

    print(normalize_text(sample))