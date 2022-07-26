const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
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

  //Búsquedas

  obtenerDominiosEIntenciones = async (uid) => {
    const usuarioConsola = await this.#firestoreDB
      .collection('agentes')
      .doc(uid)
      .get();

    const { negocio } = usuarioConsola.data();
    const dominios = await this.buscarDominios(negocio);
    const intenciones = await this.buscarIntenciones(negocio);
    const intencionesExpandidas = await intenciones.docs.map((intencion) => ({
      id: intencion.id,
      ...intencion.data(),
    }));

    const dominiosEIntenciones = await Promise.all(
      dominios.docs.map((dominio) => {
        const intencionesPorDominio = intencionesExpandidas.filter(
          (intencion) => intencion.dominio == dominio.id
        );

        return {
          id: dominio.id,
          ...dominio.data(),
          intenciones: intencionesPorDominio,
        };
      })
    );
    return { dominiosEIntenciones: dominiosEIntenciones, negocio: negocio };
  };

  generarId = (longitud) =>{
    const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for(let i = 0; i < longitud; i++){
      id += caracteres[Math.floor(Math.random()*caracteres.length)];
    }
    return id;
  }

  obtenerReglasEsquema = async () => {
    const reglas = await this.#firestoreDB
      .collection('reglas_esquema')
      .get();
      
      return reglas.docs.map(regla=>({ id: regla.id, ...regla.data() }));
  };

  obtenerAgentes = async () => {
    const reglas = await this.#firestoreDB
      .collection('agentes')
      .get();
      
      return reglas.docs.map(regla=>({ id: regla.id, ...regla.data() }));
  };

  buscarDominios = async (idNegocio) => {
    return await this.#firestoreDB
      .collection('dominios')
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

  buscarIntencionPorId = async (nombreIntencion) => {
    const intencion = await this.#firestoreDB
      .collection('intenciones')
      .doc(nombreIntencion)
      .get();

    return { id: intencion.id, ...intencion.data() };
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

  buscarSesion = async ({ idSesion, idCliente }) => {
    const sesion = await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .collection('sesiones')
      .doc(idSesion)
      .get();

    return sesion;
  };

  //Modificaciones
  
  actualizarDatosCliente = async (datosClienteActualizado, idCliente) => {
    await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .update(datosClienteActualizado);
  };
  
  agregarMensaje = async ({
    cuerpo,
    origen,
    idCliente,
    idSesion,
    id,
    fecha,
  }) => {
    await this.#firestoreDB
      .collection('clientes')
      .doc(idCliente)
      .collection('sesiones')
      .doc(idSesion)
      .collection('mensajes')
      .doc(id)
      .set({
        fecha: moment.unix(fecha._seconds),
        origen: origen,
        cuerpo: cuerpo,
      });
  };

  grabarNegocio = () => {};

  grabarCliente = () => {};

  actualizarIntencion = async ({intencion}) => {
    const {id, ...rest} = intencion;
    const intencionDoc = await this.#firestoreDB.collection('intenciones').doc(id);
    intencionDoc.update(rest);
    const intencionActualizada = await intencionDoc.get();
    return {id:intencionActualizada.id, ...intencionActualizada.data()};
  };

  grabarCanal = () => {};

  //Creaciones

  crearCliente = async ({ idNegocio, idCanal }) => {
    const estructuraBasica = {
      estadoCliente: {
        estadoUltimaRegla: '',
        intencionEnEjecucion: '',
        ultimaRegla: '',
        proximaRegla: '',
        botActivado: true,
        topico: '',
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

  crearDominio = async ({topico, uid}) => {
    const usuarioConsola = await this.#firestoreDB
      .collection('agentes')
      .doc(uid)
      .get();

    const { negocio } = await usuarioConsola.data();
    const nuevoDominio = await this.#firestoreDB
      .collection('dominios')
      .add({ negocio , topico});
      return nuevoDominio.id;
  }

  crearIntencion = async ({intencion, uid}) => {
    const usuarioConsola = await this.#firestoreDB
      .collection('agentes')
      .doc(uid)
      .get();

    const { negocio } = await usuarioConsola.data();
    const nuevaIntencion = await this.#firestoreDB
      .collection('intenciones')
      .add({ negocio , ...intencion});
      return nuevaIntencion.id;
  }

  crearRegla = async ({intencionId, regla}) => {
    const reglaId = this.generarId(20);

    const intencion = await this.#firestoreDB
      .collection('intenciones')
      .doc(intencionId)

    const IntencionActualizada = await intencion
      .update({ reglas: FieldValue.arrayUnion({...regla, id: reglaId})});
    const intencionActualizada = await intencion.get();
      return {id: intencionActualizada.id, ...intencionActualizada.data()};
  }

  //Eliminar
 
  eliminarDominio = async ({idDominio}) => {
    await this.#firestoreDB
      .collection('dominios')
      .doc(idDominio)
      .delete();
  }

  eliminarIntencion = async ({idIntencion}) => {
    await this.#firestoreDB
      .collection('intenciones')
      .doc(idIntencion)
      .delete();
  }

  eliminarRegla = () => {};

  eliminarNegocio = () => {};

  eliminarCliente = () => {};

  eliminarCanal = () => {};

 


  
}

module.exports = { ManejadorDatosInternos };
