const { plataformas } = require('../utilitarios/configuracion');

class Telegram {
  constructor() {
    this.plataforma = plataformas.TELEGRAM;
  }

  enviarMensaje = (mensaje) => {};

  procesarMensaje = (mensaje) => {};

  obtenerPlataforma = () => this.plataforma;
}

module.exports = { Telegram };
