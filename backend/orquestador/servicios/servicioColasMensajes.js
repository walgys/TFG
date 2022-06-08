const ioClient = require('socket.io-client');

class ServicioColasMensajes {
  _instancia;

  constructor() {
    this.serverAddr = 'http://localhost:4000';
    this.socket = ioClient(this.serverAddr, {
      path: '/',
    });
    this.socket.on('connect', (data) => {
      console.log(`connected to ${this.serverAddr}`);

      this.socket.on('recibirMensaje', (data) => {
        console.log(`event: recibirMensaje, ${data}`);
      });

      this.socket.on('heartbeat', () => {
        console.log('heartbeat');
      });
    });
  }

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ManejadorDatosInternos();
    }
    return this._instancia;
  }

  agregarMensaje = (mensaje) => {
    this.socket.emit('agregarMensaje', mensaje);
  };

  obtenerMensaje = () => {
    this.socket.emit('obtenerMensaje', '');
  };

  heartbeat = () => {
    this.socket.emit('heartbeat', '');
  };
}

module.exports = { ServicioColasMensajes };
