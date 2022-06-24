const { DECIR_INMEDIATAMENTE } = require('./decirInmediatamente');
const { IR_INTENCION } = require('./irIntencion');
const { MENU } = require('./menu');
class AdministradorReglas {
  static #instancia;
  #reglas = [];
  constructor() {
    this.#reglas = {
      DECIR_INMEDIATAMENTE: () => new DECIR_INMEDIATAMENTE(),
      IR_INTENCION: () => new IR_INTENCION(),
      MENU: () => new MENU(),
    };
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
