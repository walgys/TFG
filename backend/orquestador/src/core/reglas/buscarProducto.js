const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
class BUSCAR_PRODUCTO {
  ejecutarRegla = ({
    servicioColasMensajes,
    configuracionRegla,
    mensajeEntrante,
    manejadorDatosInternos,
    esRespuesta
  }) => {
    //implementacion
    const { idSocket, mensaje } = mensajeEntrante.datos;
    const { idCliente, idSesion } = JSON.parse(mensaje);
    const { texto } = configuracionRegla;
    if(esRespuesta){

    } else {
       const mensajeAWebchat = {
      cuerpo: { estado: 'recibido', texto: texto },
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
    }
    
    return { resultado: 'ok' };
  };
}

module.exports = { BUSCAR_PRODUCTO };