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
    const { idNegocio, texto } = this.#mensaje;
    const datosCliente = this.#manejadorDatosInternos; //continuar aca
    const data = {
      idNegocio: 'MiTienda',
      contexto: {
        topico: 'inicio',
      },
      clienteDice: texto,
    };
    this.#servicioPLN.buscarSimilitud();
    console.log(this.#mensaje);

    this.#terminar({ uuid: this.#uuid, resultado: texto });
  };
}

module.exports = { ManejadorDialogos };
