const { SERVICIOS } = require('../utilitarios/configuracion');

class OrquestadorMensajes {
  _instancia;
  constructor() {
    this.manejadorColasMensajes =
      SERVICIOS.servicioColasMensajes.getInstancia();
  }
  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new OrquestadorMensajes();
    }
    return this._instancia;
  }
}

module.exports = { OrquestadorMensajes };
