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
    const { idCliente, texto } = this.#mensaje;
    const datosCliente = this.#manejadorDatosInternos.buscarCliente(idCliente);
    const { topico } = datosCliente.estado;
    const data = {
      idNegocio: 'MiTienda',
      contexto: {
        topico: topico,
      },
      clienteDice: texto,
    };
    const intencionesSimilares = this.#servicioPLN.buscarSimilitud(data);
    const mejorIntencion = intencionesSimilares?.similarities?.shift();
    console.log(mejorIntencion);

    this.#terminar({ uuid: this.#uuid, resultado: mejorIntencion });
  };
}

module.exports = { ManejadorDialogos };
