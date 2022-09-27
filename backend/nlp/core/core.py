import spacy

nlp = spacy.load("es_core_news_md")

def procesar_texto(texto):
    doc = nlp(texto.lower())
    result = []
    for token in doc:
        if token.text in nlp.Defaults.stop_words:
            continue
        if token.is_punct:
            continue
        if token.lemma_ == '-PRON-':
            continue
        result.append(token.lemma_)
    return " ".join(result)

def iniciarPLN(texto_entrada):
    return nlp(procesar_texto(texto_entrada))