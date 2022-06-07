const { servicios } = require('../utilitarios/configuracion');
class ManejadorServicios {
  _instancia;
  constructor() {
    this.servicios = servicios;
  }
  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ManejadorDatosInternos();
    }
    return this._instancia;
  }

  obtenerServicio = (nombreServicio) =>
    this.servicios[nombreServicio] &&
    this.servicios[nombreServicio].getInstancia();
}

module.exports = { ManejadorServicios };
