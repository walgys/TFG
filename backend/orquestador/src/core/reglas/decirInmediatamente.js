const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
class DECIR_INMEDIATAMENTE {
  ejecutarRegla = ({
    texto,
    mensajeEntrante,
    servicioColasMensajes,
    manejadorDatosInternos,
  }) => {
    //continuar aqui
    const { idSocket, mensaje } = mensajeEntrante.datos;
    const { id, idCliente, idSesion } = JSON.parse(mensaje);
    const nuevoMensaje = {
      texto: texto,
      origen: 'bot',
      idCliente: idCliente,
      idSesion: idSesion,
      id: uuidv4(),
      fecha: { _seconds: moment().unix() },
    };
    const mensajeAWebchat = {
      cuerpo: { estado: 'recibido', texto: texto },
      origen: 'bot',
      id: uuidv4(),
      fecha: { _seconds: moment().unix() },
    };
    manejadorDatosInternos.agregarMensaje(nuevoMensaje);

    servicioColasMensajes.agregarMensaje({
      topico: 'respuesta-webchat',
      mensaje: {
        endpoint: 'mensajeBotEntrante-webchat',
        datos: { idSocket: idSocket, mensaje: JSON.stringify(mensajeAWebchat) },
      },
    });
    return { resultado: 'ok' };
  };
}

module.exports = { DECIR_INMEDIATAMENTE };
