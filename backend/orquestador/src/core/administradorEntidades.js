class AdministradorEntidades {
  static #instancia;
  #datosInternos;
  constructor() {
    console.log('AdministradorEntidades');
  }
  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new AdministradorEntidades();
    }
    return this.#instancia;
  }

  configurar = (datosInternos) => {
    this.#datosInternos = datosInternos;
  };

  obtenerAgente = (idAgente) => {};

  obtenerCanalComunicacion = (idCanalComunicacion) => {};

  obtenerNegocio = (idNegocio) => {};

  obtenerIntencion = (idIntencion) => {};

  obtenerCliente = (idCliente) => {};
}

module.exports = { AdministradorEntidades };