class AdministradorEntidades {
  _instancia;
  constructor() {
    this.datosInternos;
  }

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new AdministradorEntidades();
    }
    return this._instancia;
  }

  obtenerAgente = (idAgente) => {};

  obtenerCanalComunicacion = (idCanalComunicacion) => {};

  obtenerNegocio = (idNegocio) => {};

  obtenerIntencion = (idIntencion) => {};

  obtenerCliente = (idCliente) => {};
}

module.exports = { AdministradorEntidades };
