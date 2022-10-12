const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
class BUSCAR_PRODUCTO {
  ejecutarRegla = async ({
    servicioColasMensajes,
    configuracionRegla,
    mensajeEntrante,
    manejadorDatosInternos,
    manejadorDatosExternos,
    servicioPLN,
    esperaRespuesta
  }) => {
    //implementacion
    const { idSocket, mensaje } = mensajeEntrante.datos;
    const { idCliente, idSesion, cuerpo } = JSON.parse(mensaje);
    const { texto } = configuracionRegla;
    if(esperaRespuesta){
      try{

        const productos = await manejadorDatosExternos.buscarProductos();
        const mejoresProductos = await servicioPLN.BuscarSimilitudProductos(cuerpo.texto, productos);
        const productosAEnviar = mejoresProductos.similarities.filter(producto=>producto.similarity > 0.85).map(producto=>({...producto.producto, opciones: {agregar: true}})).slice(0,3);
        //enviar mensaje con los productos
      const cuerpoAenviar = {
        estado: 'recibido',
        tipo: 'CARD',
        cards: productosAEnviar,
        texto: texto
      };
      
      const mensajeAWebchat = {
        cuerpo: cuerpoAenviar,
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
      if(productosAEnviar.length == 0){
        return { resultado: 'empty' };
      }else{
        return { resultado: 'ok' };
      } 
      
    }catch(ex){
      console.log(ex);
      return { resultado: 'ok' };
    }
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
    return { resultado: 'ok' };
    }
    
    
  };
}

module.exports = { BUSCAR_PRODUCTO };