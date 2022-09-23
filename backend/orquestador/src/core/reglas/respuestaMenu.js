class RESPUESTA_MENU {
  ejecutarRegla = ({ servicioColasMensajes,
    configuracionRegla,
    mensajeEntrante,
    manejadorDatosInternos}) => {
      let respuesta = { cambioIntencion: false };
      const {mensaje} = mensajeEntrante.datos;
      const parsedMensaje = JSON.parse(mensaje);
      if(parsedMensaje.cuerpo.opcion){
        switch (parsedMensaje.cuerpo.opcion.accion){
          case 'IR_INTENCION':
            respuesta = { cambioIntencion: true, nuevaIntencion: parsedMensaje.cuerpo.opcion.idIntencion };
        }
      }
    return respuesta
  };
}

module.exports = { RESPUESTA_MENU };
