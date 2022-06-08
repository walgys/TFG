const { plataformas } = require('../utilitarios/configuracion');

class Webchat {
  constructor() {
    this.plataforma = plataformas.WEBCHAT;
  }

  enviarMensaje = (mensaje) => {};

  procesarMensaje = (mensaje) => {};

  obtenerPlataforma = () => this.plataforma;
}

module.exports = { Webchat };
