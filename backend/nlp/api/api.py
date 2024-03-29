from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from core import core
from data import data


app = Flask(__name__)

api = Api(app)


class BuscarSimilitudHilo(Resource):
    def post(self):
        try:
            id_negocio = request.json["idNegocio"]
            contexto = request.json["contexto"]
            clienteDice = core.iniciarPLN(request.json["clienteDice"])
            dominios = data.obtener_dominios_e_intenciones(id_negocio)
            return jsonify(
                customerSays=request.json["clienteDice"],
                similarities=buscarSimilitud(dominios, clienteDice, contexto),
            )
        except Exception as ex:
            return jsonify(error=str(ex))

class BuscarSimilitudPalabrasHilo(Resource):
    def post(self):
        try:
            palabras = request.json["palabras"]
            clienteDice = core.iniciarPLN(request.json["clienteDice"])
            return jsonify(
                customerSays=request.json["clienteDice"],
                similarities=buscarSimilitudPalabras(clienteDice, palabras),
            )
        except Exception as ex:
            return jsonify(error=str(ex))

class BuscarSimilitudProductosHilo(Resource):
    def post(self):
        try:
            productos = request.json["productos"]
            clienteDice = core.iniciarPLN(request.json["clienteDice"])
            return jsonify(
                customerSays=request.json["clienteDice"],
                similarities=buscarSimilitudProductos(clienteDice, productos),
            )
        except Exception as ex:
            return jsonify(error=str(ex))


def buscarSimilitud(dominios, clienteDice, contexto):
    resultados = []

    if len(contexto["topico"]) > 0:
        for dominio in dominios:
            if dominio["topico"] == contexto["topico"]:
                for intencion in dominio["intenciones"]:
                    resultados_parciales = []
                    for disparador in intencion["disparadores"]:
                        if disparador == "*":
                            resultados.append(
                                {
                                    "topico": dominio["topico"],
                                    "intention": intencion,
                                    "similarity": 1.0,
                                }
                            )
                        else:
                            comparable_Intention = core.iniciarPLN(disparador)
                            resultados_parciales.append(
                                clienteDice.similarity(comparable_Intention)
                            )
                            resultados_parciales.sort(key=lambda x: x, reverse=False)
                        if len(resultados_parciales) > 0:
                            resultados.append(
                                {
                                    "topico": dominio["topico"],
                                    "intention": intencion,
                                    "similarity": resultados_parciales.pop(),
                                }
                            )
        if len(resultados) == 0:
            resultados.append(
                {"topico": "", "intention": "NO_ENTIENDE", "similarity": 1}
            )
        resultados.sort(key=lambda x: x["similarity"], reverse=True)
        return resultados[:5]
    else:
        for dominio in dominios:
            for intencion in dominio["intenciones"]:
                resultados_parciales = []
                for disparador in intencion["disparadores"]:
                    if disparador == "*":
                        resultados.append(
                            {
                                "topico": dominio["topico"],
                                "intention": intencion,
                                "similarity": 1.0,
                            }
                        )
                    else:
                        comparable_Intention = core.iniciarPLN(disparador)
                        resultados_parciales.append(
                            clienteDice.similarity(comparable_Intention)
                        )
                resultados_parciales.sort(key=lambda x: x, reverse=False)
                if len(resultados_parciales) > 0:
                    resultados.append(
                        {
                            "topico": dominio["topico"],
                            "intention": intencion,
                            "similarity": resultados_parciales.pop(),
                        }
                    )
        if len(resultados) == 0:
            resultados.append(
                {"topico": "", "intention": "NO_ENTIENDE", "similarity": 1}
            )
        resultados.sort(key=lambda x: x["similarity"], reverse=True)
        return resultados[:5]

def buscarSimilitudPalabras(clienteDice, palabras):
    resultados = []
    for palabra in palabras:
        palabra_nlp = core.iniciarPLN(palabra)
        resultados.append({"word": palabra, "similarity": clienteDice.similarity(palabra_nlp)})
    resultados.sort(key=lambda x: x["similarity"], reverse=True)
    return resultados[:5]

def buscarSimilitudProductos(clienteDice, productos):
    resultados = []
    for producto in productos:
        producto_nlp = core.iniciarPLN(producto["nombre"])
        resultados.append({"producto": producto, "similarity": clienteDice.similarity(producto_nlp)})
    resultados.sort(key=lambda x: x["similarity"], reverse=True)
    print(resultados[:5])
    return resultados[:5]


api.add_resource(BuscarSimilitudHilo, "/buscarSimilitudIntenciones")
api.add_resource(BuscarSimilitudPalabrasHilo, "/buscarSimilitudPalabras")
api.add_resource(BuscarSimilitudProductosHilo, "/buscarSimilitudProductos")
