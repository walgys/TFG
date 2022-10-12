const axios = require('axios');

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

  buscarProductos = async () => {
      const callResult = await axios({
      method: 'GET',
      url: 'http://localhost:10000/api/v1/productos',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(ex=>console.log(ex));
    return callResult.data;
  };

  buscarClienteExterno = () => {};

  buscarPedidos = () => {};

  buscarEstadoCuenta = () => {};

  crearPedido = () => {};
  crearConsulta = () => {};
}

module.exports = { ManejadorDatosExternos };
