class ServicioColasAtencion {
  _instancia;
  constructor() {}
  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ServicioColasAtencion();
    }
    return this._instancia;
  }
}

module.exports = { ServicioColasAtencion };
