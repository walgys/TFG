class ServicioColasMensajes {
  _instancia;
  constructor() {}
  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ManejadorDatosInternos();
    }
    return this._instancia;
  }
}

module.exports = { ServicioColasMensajes };
