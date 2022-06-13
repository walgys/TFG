const ioClient = require('socket.io-client');

class AdministradorConexion {
  _instancia;

  constructor() {
    this.serverAddr = 'http://localhost:8000';
    this.socket = ioClient.connect(this.serverAddr);
    this.socket.on('connect', this.procesarMensajeWebsocket);
  }

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new AdministradorConexion();
    }
    return this._instancia;
  }

  procesarMensajeWebsocket = (client) => {
    console.log(`connected to ${this.serverAddr}`);

    this.socket.on('recibiMensajeConsolaEntrante', (data) => {
      console.log(`event: recibiMensajeConsolaEntrante, ${data}`);
    });

    this.socket.on('heartbeat', () => {
      console.log('heartbeat');
    });
  };

  enviarMensaje = (mensaje) => {
    console.log('me apretaste');
    this.socket.emit('mensajeConsolaEntrante', JSON.stringify(mensaje));
  };

  obtenerMensaje = () => {
    this.socket.emit('obtenerMensaje', '');
  };

  heartbeat = () => {
    console.log('emait');
    this.socket.emit('heartbeat', '');
  };
}

export default AdministradorConexion;