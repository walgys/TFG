const io = require('socket.io');
class ApiConsola {
  static #instancia;
  #datosInternos;
  #verificadorTokens;
  constructor() {
    this.websocket = new io.Server(8000, {
      cors: {
        origin: '*',
      },
    });
    console.log('ApiConsola');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ApiConsola();
    }
    return this.#instancia;
  }
  configurar = (datosInternos, verificadorTokens) => {
    this.#datosInternos = datosInternos;
    this.#verificadorTokens = verificadorTokens;
    this.websocket.on('connection', this.procesarMensajeWebsocket);
  };

  procesarMensajeWebsocket = (client) => {
    console.log('someone connected');

    client.on('mensajeConsolaEntrante', (data) => {
      const parsedData = JSON.parse(data);
      console.log(`event: mensajeConsolaEntrante, data: ${data}`);
      client.emit(
        'recibiMensajeConsolaEntrante',
        JSON.stringify({ id: parsedData.id })
      );
    });

    client.on('heartbeat', () => {
      console.log('heartbeat');
      client.emit('heartbeat', '');
    });

    client.on('disconnect', () => {
      console.log('client disconnected');
    });
  };

  procesarMensaje = () => {};

  _abmIntencion = () => {};

  _abmCanal = () => {};

  _abmNegocio = () => {};
}

module.exports = { ApiConsola };
