const { DECIR_INMEDIATAMENTE } = require('./decirInmediatamente');

class AdministradorReglas {
  static #instancia;
  #reglas = [];
  constructor() {
    this.#reglas = { DECIR_INMEDIATAMENTE: () => new DECIR_INMEDIATAMENTE() };
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new AdministradorReglas();
    }
    return this.#instancia;
  }

  buscarRegla = (reglaABuscar) => {
    return this.#reglas[reglaABuscar]();
  };
}

module.exports = { AdministradorReglas };
