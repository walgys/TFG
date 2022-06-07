const { ManejadorDatosInternos } = require('./manejadorDatosInterno');

class ApiConsola {
  _instancia;

  constructor() {
    this.datosInternos = ManejadorDatosInternos.getInstancia();
    this.websocket = '';
  }

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ApiConsola();
    }
    return this._instancia;
  }

  procesarMensaje = () => {};

  _abmIntencion = () => {};

  _abmCanal = () => {};

  _abmNegocio = () => {};
}

module.exports = { ApiConsola };
