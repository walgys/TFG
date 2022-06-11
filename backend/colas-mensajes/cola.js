class Cola {
  _instancia;
  _cola = [];
  constructor() {}
  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new Cola();
    }
    return this._instancia;
  }
  ponerEnCola = (mensaje) => {
    this._cola.push(mensaje);
  };
  sacarDeCola = () => this._cola.shift();
}

module.exports = { Cola };
