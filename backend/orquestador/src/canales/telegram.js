const { PLATAFORMAS } = require('../utilitarios/configuracion');

class Telegram {
  constructor() {
    this.plataforma = PLATAFORMAS.TELEGRAM;
  }

  enviarMensaje = (mensaje) => {};

  procesarMensaje = (mensaje) => {};

  obtenerPlataforma = () => this.plataforma;
}

module.exports = { Telegram };
