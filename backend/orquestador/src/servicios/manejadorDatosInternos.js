const { initializeApp } = require('firebase-admin/app');
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
    console.log('ManejadorDatosInternos');
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

  buscarIntencion = async (idNegocio, nombreIntencion) => {
    const intenciones = await this.#firestoreDB
      .collection('intenciones')
      .where('negocio', '==', idNegocio)
      .where('intencion', '==', nombreIntencion)
      .get();

    return Promise.all(
      intenciones.docs.map((intencion) => ({
        id: intencion.id,
        ...intencion.data(),
      }))
    );
  };

  buscarCanales = async (idNegocio) => {
    return await this.#firestoreDB
      .collection('canales')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarCliente = async ({ idCliente }) => {
    const cliente = await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .get();
    return { id: cliente.id, ...cliente.data() };
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

  crearCliente = async ({ idNegocio, idCanal }) => {
    const estructuraBasica = {
      estadoCliente: {
        estadoUltimaRegla: '',
        intencionEnEjecucion: '',
        ultimaRegla: '',
        variablesCliente: {
          nombre: '',
          valor: '',
        },
      },
      fecha: moment(),
    };

    const idCliente = await this.#firestoreDB
      .collection('clientes')
      .add({ ...estructuraBasica, canal: idCanal, negocio: idNegocio });
    return idCliente.id;
  };

  crearSesion = async (idCliente) => {
    const sesion = await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .collection('sesiones')
      .add({ fecha: moment() });
    return sesion;
  };

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

  agregarMensaje = async ({ texto, origen, idCliente, idSesion }) => {
    await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .collection('sesiones')
      .doc(idSesion)
      .collection('mensajes')
      .add({
        fecha: moment(),
        origen: origen,
        cuerpo: { estado: 'enviado', texto: texto },
      });
  };

  buscarSesion = async ({ idSesion, idCliente }) => {
    const sesion = await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .collection('sesiones')
      .doc(idSesion)
      .get();

    return sesion;
  };

  verificarToken = async (token) => admin.auth().verifyIdToken(token);
}

module.exports = { ManejadorDatosInternos };
