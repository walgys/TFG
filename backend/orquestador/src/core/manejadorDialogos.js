class ManejadorDialogos {
  #administradorEntidades;
  #manejadorDatosExternos;
  #manejadorDatosInternos;
  #servicioPLN;
  #uuid;
  #estado;
  #mensaje;
  #terminar;

  constructor(
    administradorEntidades,
    manejadorDatosExternos,
    manejadorDatosInternos,
    administradorReglas,
    servicioPLN,
    uuid,
    mensaje,
    terminar
  ) {
    this.#administradorEntidades = administradorEntidades;
    this.#manejadorDatosExternos = manejadorDatosExternos;
    this.#manejadorDatosInternos = manejadorDatosInternos;
    this.#servicioPLN = servicioPLN;
    this.#uuid = uuid;
    this.#mensaje = mensaje;
    this.#terminar = terminar;
    this.#procesarMensaje();
    console.log('ManejadorDialogos');
  }

  #procesarMensaje = async () => {
    const { idSocket, mensaje } = this.#mensaje.datos;
    const { idCliente, texto } = JSON.parse(mensaje);

    const datosCliente = await this.#manejadorDatosInternos.buscarCliente({
      idCliente,
    });
    const { topico } = datosCliente.estadoCliente;
    const data = {
      idNegocio: 'MiTienda',
      contexto: {
        topico: topico,
      },
      clienteDice: texto,
    };
    const intencionesSimilares = await this.#servicioPLN.buscarSimilitud(data);
    const mejorIntencion = intencionesSimilares?.similarities?.shift();

    this.#manejadorDatosInternos.actualizarEstadoCliente();
    console.log(mejorIntencion);

    this.#terminar({ uuid: this.#uuid, resultado: mejorIntencion });
  };
}

module.exports = { ManejadorDialogos };
