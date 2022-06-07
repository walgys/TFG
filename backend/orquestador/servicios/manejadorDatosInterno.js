const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const path = require('path');
class ManejadorDatosInternos {
  constructor() {
    this.firebaseApp = initializeApp({
      credential: admin.credential.cert(
        path.resolve(
          __dirname,
          '../../certs/tfg-infra-data-firebase-adminsdk-kl9wp-d22334161f.json'
        )
      ),
    });
    this.firestoreDB = getFirestore();
  }

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ManejadorDatosInternos();
    }
    return this._instancia;
  }

  obtenerReglas = async () => {
    return await this.firestoreDB
      .collection('reglas_esquema')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarIntenciones = async (idNegocio) => {
    return await this.firestoreDB
      .collection('intenciones')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarCanales = async (idNegocio) => {
    return await this.firestoreDB
      .collection('canales')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarCliente = async (idNegocio) => {
    return await this.firestoreDB
      .collection('clientes')
      .where('negocio', '==', idNegocio)
      .get();
  };

  buscarNegocio = async (idNegocio) => {
    return await this.firestoreDB
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

  buscarHistorialConversacion = () => {};

  verificarToken = async (token) => admin.auth().verifyIdToken(token);
}

module.exports = { ManejadorDatosInternos };
