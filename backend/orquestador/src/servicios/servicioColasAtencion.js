class ServicioColasAtencion {
  static #instancia;
  constructor() {}
  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ServicioColasAtencion();
    }
    return this.#instancia;
  }
}

module.exports = { ServicioColasAtencion };
