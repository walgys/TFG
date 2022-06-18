const ioClient = require('socket.io-client');

class ServicioColasMensajes {
  static #instancia;
  #serverAddr;
  #socket;
  #callbacks = [];
  constructor() {
    this.#serverAddr = 'http://localhost:4000';
    this.#socket = ioClient(this.#serverAddr, {
      path: '/',
    });
    this.#socket.on('connect', this.#procesarMensajeWebsocket);
    console.log('ServicioColasMensajes');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ServicioColasMensajes();
    }
    return this.#instancia;
  }

  #procesarMensajeWebsocket = (client) => {
    console.log('Conectado  ');

    this.#socket.on('respuestaAgregarMensaje', (datos) => {
      //console.log(`event: respuestaAgregarMensaje, data: ${datos}`);
    });

    this.#socket.on('respuestaObtenerMensajes', (datos) => {
      const objetoDatos = JSON.parse(datos);
      const callback = this.#callbacks.find(
        (callback) => callback.id === objetoDatos.idCallback
      );
      this.#callbacks = this.#callbacks.filter(
        (cb) => cb.id !== objetoDatos.idCallback
      );
      callback && callback.ejecutar(objetoDatos.mensajes);
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

  obtenerMensajes = (cantidad, callback) => {
    this.#callbacks.push(callback);
    this.#socket.emit(
      'obtenerMensajes',
      JSON.stringify({ cantidad: cantidad, idCallback: callback.id })
    );
  };

  heartbeat = () => {
    this.#socket.emit('heartbeat', '');
  };
}

module.exports = { ServicioColasMensajes };
