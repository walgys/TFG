const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class MENU {
  ejecutarRegla = ({
    servicioColasMensajes,
    configuracionRegla,
    mensajeEntrante,
    manejadorDatosInternos,
  }) => {
    const { opciones, titulo, encabezado } = configuracionRegla;
    const { idSocket, mensaje } = mensajeEntrante.datos;
    const { idCliente, idSesion } = JSON.parse(mensaje);

    const mensajeAWebchat = {
      cuerpo: {
        tipo: 'MENU',
        opciones: opciones,
        titulo: titulo,
        encabezado: encabezado ? encabezado : '',
        estado: 'recibido',
      },
      origen: 'bot',
      id: uuidv4(),
      fecha: { _seconds: moment().unix() },
    };

    manejadorDatosInternos.agregarMensaje({
      ...mensajeAWebchat,
      idCliente: idCliente,
      idSesion: idSesion,
    });

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

module.exports = { MENU };
