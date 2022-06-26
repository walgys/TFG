const { parentPort, workerData } = require('worker_threads');
const {
  ManejadorDatosInternos,
} = require('../../servicios/manejadorDatosInternos');
const {
  ServicioColasMensajes,
} = require('../../servicios/servicioColasMensajes');
const { VerificadorTokens } = require('../../servicios/verificadorTokens');
const verificadorTokens = new VerificadorTokens();
const manejadorColasMensajes = new ServicioColasMensajes();
const manejadorDatosInternos = new ManejadorDatosInternos();
const moment = require('moment');
// Something you shouldn"t run in main thread
// since it will block.

const endpoints = {
  'webchat-mensajeEntrante': procesarMensajeEntrante,
  'webchat-obtenerCliente': procesarObtenerCliente,
  'webchat-buscarHistorialConversacion': procesarBuscarHistorialConversacion,
};

function esTokenValido(token, idSocket) {
  const tokenDecofificado = verificadorTokens.verificarTokenPlataforma(token);
  if (tokenDecofificado.error) {
    manejadorColasMensajes.agregarMensaje({
      topico: 'respuesta-webchat',
      mensaje: {
        endpoint: 'token-error-webchat',
        datos: { idSocket: idSocket, mensaje: tokenDecofificado.error },
      },
    });
    return false;
  }
  return tokenDecofificado;
}

async function procesarMensajeEntrante(datos) {
  const objetoDatos = JSON.parse(datos);
  const { token, idSesion, idCliente, idSocket } = objetoDatos;

  const tokenDecofificado = esTokenValido(token, idSocket);
  if (tokenDecofificado) {
    const { idNegocio } = tokenDecofificado;
    let sesion = await manejadorDatosInternos.buscarSesion({
      idSesion,
      idCliente,
    });

    if (sesion) {
      const validSesion =
        moment() - moment().unix(sesion?.fecha?._seconds) > 0 ? true : false;
      if (!validSesion) {
        const nuevaSesion = await manejadorDatosInternos.crearSesion(idCliente);
        if (nuevaSesion) sesion = nuevaSesion;
      }
    }

    manejadorDatosInternos.agregarMensaje({
      ...objetoDatos,
      sesion: sesion.id,
      cuerpo: { ...objetoDatos.cuerpo, estado: 'recibido' },
    });

    manejadorColasMensajes.agregarMensaje({
      topico: 'respuesta-webchat',
      mensaje: {
        endpoint: 'recibiMensajeEntrante-webchat',
        datos: {
          idSocket: idSocket,
          mensaje: JSON.stringify({
            ...objetoDatos,
            sesion: sesion.id,
          }),
        },
      },
    });
    const datos = {
      idSocket: idSocket,
      mensaje: JSON.stringify({
        ...objetoDatos,
        sesion: sesion.id,
      }),
    };
    manejadorColasMensajes.agregarMensaje({
      topico: 'orquestadorManejadorDialogos',
      mensaje: {
        datos: datos,
      },
    });
  }
  return 'procesarMensajeEntrante';
}

async function procesarObtenerCliente(datos) {
  const objetoDatos = JSON.parse(datos);
  const { idSocket } = objetoDatos;
  if (!objetoDatos.token || objetoDatos.token === '') {
    const idCliente = await manejadorDatosInternos.crearCliente(objetoDatos);
    const token = await verificadorTokens.generarTokenWebchat({
      ...objetoDatos,
      idCliente: idCliente,
    });

    let datos = {
      idSocket: idSocket,
      mensaje: JSON.stringify({
        idCliente: idCliente,
        token: token,
      }),
    };

    manejadorColasMensajes.agregarMensaje({
      topico: 'respuesta-webchat',
      mensaje: {
        endpoint: 'registrar-webchat',
        datos: datos,
      },
    });
    return;
  }

  const tokenDecofificado = esTokenValido(objetoDatos.token, idSocket);
  datos = {
    idSocket: idSocket,
    mensaje: JSON.stringify({ idCliente: tokenDecofificado.idCliente }),
  };
  if (tokenDecofificado) {
    manejadorColasMensajes.agregarMensaje({
      topico: 'respuesta-webchat',
      mensaje: {
        endpoint: 'respuestaObtenerCliente-webchat',
        datos: datos,
      },
    });
  }
  return 'procesarObtenerCliente';
}

async function procesarBuscarHistorialConversacion(datos) {
  const objetoDatos = JSON.parse(datos);
  const { idSocket, idCliente, id } = objetoDatos;
  const tokenDecofificado = esTokenValido(objetoDatos.token, idSocket);
  if (tokenDecofificado) {
    let sesiones = await manejadorDatosInternos.buscarHistorialConversacion(
      idCliente
    );
    if (sesiones.length == 0) {
      const intenciones = await manejadorDatosInternos.buscarIntencion(
        tokenDecofificado.idNegocio,
        'SALUDO INICIAL'
      );
      const mensaje = intenciones[0]?.reglas[0]?.configuracion?.texto;
      if (mensaje) {
        const nuevaSesion = await manejadorDatosInternos.crearSesion(idCliente);
        await manejadorDatosInternos.agregarMensaje({
          cuerpo: { texto: mensaje, estado: 'recibido' },
          idSesion: nuevaSesion.id,
          idCliente: idCliente,
          id: id,
          origen: 'bot',
          fecha: { _seconds: moment().unix() },
        });
        sesiones = await manejadorDatosInternos.buscarHistorialConversacion(
          idCliente
        );
      }
    }
    const datos = {
      idSocket: idSocket,
      mensaje: JSON.stringify({ idCliente: idCliente, sesiones: sesiones }),
    };
    manejadorColasMensajes.agregarMensaje({
      topico: 'respuesta-webchat',
      mensaje: {
        endpoint: 'respuestaBuscarHistorialConversacion-webchat',
        datos: datos,
      },
    });
  }
  return 'procesarBuscarHistorialConversacion';
}
// Main thread will pass the data you need
// through this event listener.
parentPort.on('message', async (params) => {
  const { datos, endpoint } = params;
  const accion = endpoints[endpoint];
  let result;
  if (accion) {
    result = await accion(datos);
  }

  // Access the workerData.

  // return the result to main thread.
  parentPort.postMessage(result);
});
