class Cola {
  #cola = [];
  #topico;
  constructor(topico) {
    this.#topico = topico;
  }

  ponerEnCola = (mensaje) => {
    this.#cola.push(mensaje);
  };
  sacarDeCola = (cantidad) => this.#cola.splice(-cantidad);

  obtenerTopico = () => this.#topico;
}

module.exports = { Cola };
