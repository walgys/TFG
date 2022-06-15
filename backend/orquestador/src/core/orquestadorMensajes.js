const { SERVICIOS } = require('../utilitarios/configuracion');

class OrquestadorMensajes {
  static #instancia;
  #manejadorColasMensajes;
  constructor(manejadorMensajes) {
    this.#manejadorColasMensajes =
      manejadorMensajes.servicios.manejadoColasMensajes;
  }
  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new OrquestadorMensajes();
    }
    return this.#instancia;
  }
}

module.exports = { OrquestadorMensajes };
