const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const path = require('path');
const moment = require('moment');

class ManejadorDatosInternos {
  #firebaseApp;
  #firestoreDB;
  static #instancia;
  constructor() {
    this.#firebaseApp = initializeApp({
      credential: admin.credential.cert(
        path.resolve(
          __dirname,
          '../../../certs/tfg-infra-data-firebase-adminsdk-kl9wp-d22334161f.json'
        )
      ),
    });
    this.#firestoreDB = getFirestore();
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorDatosInternos();
    }
    return this.#instancia;
  }

  obtenerReglas = async () => {
    return await this.#firestoreDB
      .collection('reglas_esquema')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarIntenciones = async (idNegocio) => {
    return await this.#firestoreDB
      .collection('intenciones')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarCanales = async (idNegocio) => {
    return await this.#firestoreDB
      .collection('canales')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarCliente = async (idNegocio) => {
    return await this.#firestoreDB
      .collection('clientes')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarNegocio = async (idNegocio) => {
    return await this.#firestoreDB
      .collection('negocio')
      .where('negocio', '==', idNegocio)
      .get();
  };

  grabarRegla = () => {};

  grabarNegocio = () => {};

  grabarCliente = () => {};

  grabarIntencion = () => {};

  grabarCanal = () => {};

  eliminarRegla = () => {};

  eliminarNegocio = () => {};

  eliminarIntencion = () => {};

  eliminarCliente = () => {};

  eliminarCanal = () => {};

  buscarHistorialConversacion = async (
    idCliente,
    fechaInicio = moment().subtract(1, 'months'),
    fechaFinal = moment()
  ) => {
    const result = await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .collection('sesiones')
      .where('fecha', '>', moment(fechaInicio))
      .where('fecha', '<', moment(fechaFinal))
      .orderBy('fecha', 'asc')
      .get();

    return Promise.all(
      result.docs.map(async (sesion) => {
        const result = await this.#firestoreDB
          .collection('clientes')
          .doc(idCliente)
          .collection('sesiones')
          .doc(sesion.id)
          .collection('mensajes')
          .orderBy('fecha', 'asc')
          .get();

        const mensajes = await result.docs.map((mensaje) => {
          const datosMensaje = { ...mensaje.data() };
          return {
            id: mensaje.id,
            ...datosMensaje,
            fecha: datosMensaje.fecha,
          };
        });
        const sesionData = { ...sesion.data() };
        return {
          id: sesion.id,
          ...sesionData,
          fecha: sesionData.fecha,
          mensajes: mensajes,
        };
      })
    );
  };

  buscarMensajes = async (idSesion, idCliente) => {
    return;
  };

  verificarToken = async (token) => admin.auth().verifyIdToken(token);
}

module.exports = { ManejadorDatosInternos };
