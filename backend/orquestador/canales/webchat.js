const { PLATAFORMAS } = require('../utilitarios/configuracion');

class Webchat {
  constructor() {
    this.plataforma = PLATAFORMAS.WEBCHAT;
  }

  enviarMensaje = (mensaje) => {};

  procesarMensaje = (mensaje) => {};

  obtenerPlataforma = () => this.plataforma;
}

module.exports = { Webchat };
