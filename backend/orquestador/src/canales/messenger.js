const { PLATAFORMAS } = require('../utilitarios/configuracion');

class Messenger {
  constructor() {
    this.plataforma = PLATAFORMAS.MESSENGER;
  }

  enviarMensaje = (mensaje) => {};

  procesarMensaje = (mensaje) => {};

  obtenerPlataforma = () => this.plataforma;
}

module.exports = { Messenger };
