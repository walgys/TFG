const ioClient = require('socket.io-client');

class ServicioColasMensajes {
  static #instancia;
  #serverAddr;
  #socket;
  constructor() {
    this.#serverAddr = 'http://localhost:4000';
    this.#socket = ioClient(this.serverAddr, {
      path: '/',
    });
    this.#socket.on('connect', this.#procesarMensajeWebsocket);
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ServicioColasMensajes();
    }
    return this.#instancia;
  }

  #procesarMensajeWebsocket = (client) => {
    console.log('someone connected');

    this.#socket.on('respuestaAgregarMensaje', (mensaje) => {
      console.log(`event: respuestaAgregarMensaje, data: ${mensaje}`);
    });

    this.#socket.on('respuestaObtenerMensaje', (mensaje) => {
      console.log(`event: respuestaObtenerMensaje, mensaje: ${mensaje}`);
    });

    this.#socket.on('heartbeat', () => {
      console.log('heartbeat');
      client.emit('heartbeat', '');
    });

    this.#socket.on('disconnect', () => {
      console.log('client disconnected');
    });
  };

  agregarMensaje = (mensaje) => {
    this.#socket.emit('agregarMensaje', JSON.stringify(mensaje));
  };

  obtenerMensaje = () => {
    this.#socket.emit('obtenerMensaje', '');
  };

  heartbeat = () => {
    this.#socket.emit('heartbeat', '');
  };
}

module.exports = { ServicioColasMensajes };
