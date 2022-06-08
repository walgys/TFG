const { plataformas } = require('../utilitarios/configuracion');

class Messenger {
  constructor() {
    this.plataforma = plataformas.MESSENGER;
  }

  enviarMensaje = (mensaje) => {};

  procesarMensaje = (mensaje) => {};

  obtenerPlataforma = () => this.plataforma;
}

module.exports = { Messenger };
