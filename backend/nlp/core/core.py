import spacy

nlp = spacy.load("es_core_news_md")

def iniciarPLN(texto_entrada):
    return nlp(texto_entrada)