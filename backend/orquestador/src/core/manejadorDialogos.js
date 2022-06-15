class ManejadorDialogos {
  #administradorEntidades;
  #manejadorDatosExternos;
  #manejadorServicios;
  constructor(
    administradorEntidades,
    manejadorDatosExternos,
    manejadorServicios
  ) {
    this.#administradorEntidades = administradorEntidades;
    this.#manejadorDatosExternos = manejadorDatosExternos;
    this.#manejadorServicios = manejadorServicios;
  }
}
