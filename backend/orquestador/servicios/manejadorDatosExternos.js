const { axios } = require('axios');

class ManejadorDatosExternos {
  _instancia;
  constructor() {}

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ManejadorDatosInternos();
    }
    return this._instancia;
  }

  buscarListaProductos = () => {};

  buscarClienteExterno = () => {};

  buscarPedidos = () => {};

  buscarEstadoCuenta = () => {};

  crearPedido = () => {};
  crearConsulta = () => {};
}

module.exports = { ManejadorDatosExternos };
