const { axios } = require('axios');

class ManejadorDatosExternos {
  static #instancia;
  constructor() {}

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorDatosExternos();
    }
    return this.#instancia;
  }

  buscarListaProductos = () => {};

  buscarClienteExterno = () => {};

  buscarPedidos = () => {};

  buscarEstadoCuenta = () => {};

  crearPedido = () => {};
  crearConsulta = () => {};
}

module.exports = { ManejadorDatosExternos };
