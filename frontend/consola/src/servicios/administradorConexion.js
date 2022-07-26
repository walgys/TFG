const ioClient = require('socket.io-client');

class AdministradorConexion {
  static #instancia;
  #setEstado;
  constructor(setEstado) {
    this.serverAddr = 'http://localhost:8000';
    this.socket = ioClient.connect(this.serverAddr);
    this.#setEstado = setEstado;
    this.socket.on('connect', this.procesarMensajeWebsocket);
  }

  static getInstancia(setEstado) {
    if (!this.#instancia) {
      this.#instancia = new AdministradorConexion(setEstado);
    }
    return this.#instancia;
  }

  procesarMensajeWebsocket = (client) => {
    console.log(`connected to ${this.serverAddr}`);

    this.socket.on('respuestaConsola', (datos) => {
      const objetoDatos = JSON.parse(datos);
      this.#setEstado((prevState) => ({ ...prevState, ...objetoDatos }));
    });

    this.socket.on('heartbeat', () => {
      console.log('heartbeat');
    });
  };

  enviarMensaje = ({tipo, mensaje}) => {  
    this.socket.emit(tipo, JSON.stringify(mensaje));
  };

  heartbeat = () => {
    this.socket.emit('heartbeat', '');
  };
}

export default AdministradorConexion;
