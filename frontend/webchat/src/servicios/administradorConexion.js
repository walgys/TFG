const ioClient = require('socket.io-client');

class AdministradorConexion {
  static #instancia;
  #serverAddr;
  #socket;
  #setEstado;
  constructor() {
    this.#serverAddr = 'http://localhost:9000';
    this.#socket = ioClient.connect(this.#serverAddr);
    this.#socket.on('connect', this.#procesarMensajeWebsocket);
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new AdministradorConexion();
    }
    return this.#instancia;
  }

  configurar = (setEstado) => {
    this.#setEstado = setEstado;
  };

  #procesarMensajeWebsocket = (client) => {
    console.log(`connected to ${this.#serverAddr}`);

    this.#socket.on('recibiMensajeEntrante-webchat', (data) => {
      console.log(data);
    });

    this.#socket.on('respuestabuscarHistorialConversacion-webchat', (data) => {
      const parsedData = JSON.parse(data);
      this.#setEstado((prevState) => ({
        ...prevState,
        sesiones: parsedData.sesiones,
      }));
    });

    this.#socket.on('heartbeat', () => {
      console.log('heartbeat');
    });
  };

  enviarMensaje = (mensaje) => {
    this.#socket.emit('webchat-mensajeEntrante', JSON.stringify(mensaje));
  };

  obtenerMensaje = () => {
    this.#socket.emit('webchat-obtenerMensaje', '');
  };

  heartbeat = () => {
    console.log('emait');
    this.#socket.emit('heartbeat', '');
  };

  obtenerCliente = () => {
    this.#socket.emit('webchat-nuevoCliente');
  };

  buscarHistorialConversacion = (data) => {
    this.#socket.emit(
      'webchat-buscarHistorialConversacion',
      JSON.stringify(data)
    );
  };
}

export default AdministradorConexion;
