from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def match_score(resume_text, job_text):
    texts = [resume_text, job_text]

    vectorizer = CountVectorizer()
    matrix = vectorizer.fit_transform(texts)

    score = cosine_similarity(matrix)[0][1]

    return round(score * 100, 2)