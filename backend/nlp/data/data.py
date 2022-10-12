import firebase_admin
from pathlib import Path

p = Path(__file__).parents[2]

from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(
    str(p) + "/certs/tfg-infra-data-firebase-adminsdk-kl9wp-d22334161f.json"
)
firebase_admin.initialize_app(cred)


def obtener_dominios_e_intenciones(negocio):
    db = firestore.client()
    dominios = db.collection("dominios").where("negocio", "==", negocio).stream()

    dominios_dict = []

    for dominio in dominios:
        lista_intenciones = (
            db.collection("intenciones").where("dominio", "==", dominio.id).stream()
        )
        intenciones = []

        for inten in lista_intenciones:
            data = inten.to_dict()
            data["id"] = inten.id
            intenciones.append(data)

        dominio_objeto = dominio.to_dict()
        dominio_objeto["intenciones"] = intenciones
        dominios_dict.append(dominio_objeto)

    return dominios_dict
