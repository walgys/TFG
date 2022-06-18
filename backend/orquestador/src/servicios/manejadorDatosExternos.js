const { axios } = require('axios');

class ManejadorDatosExternos {
  static #instancia;
  constructor() {
    console.log('ManejadorDatosExternos');
  }

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
