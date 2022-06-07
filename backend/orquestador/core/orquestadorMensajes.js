class OrquestadorMensajes {
  _instancia;
  constructor(manejadorServicios) {
    this.manejadorServicios = manejadorServicios.getInstancia();
    this.servicioColasMensajes =
      this.manejadorServicios.obtenerServicio('colasMensajes');
  }
  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ManejadorDatosInternos();
    }
    return this._instancia;
  }
}

module.exports = { OrquestadorMensajes };
