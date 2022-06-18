import moment from 'moment';

const ioClient = require('socket.io-client');

class AdministradorConexion {
  static #instancia;
  #serverAddr;
  #socket;
  #setEstado;
  #setCookie;
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

  configurar = (setEstado, setCookie) => {
    this.#setEstado = setEstado;
    this.#setCookie = setCookie;
  };

  #procesarMensajeWebsocket = (clienteWS) => {
    console.log(`connected to ${this.#serverAddr}`);

    this.#socket.on('recibiMensajeEntrante-webchat', (datos) => {
      this.#setEstado((prevState) => ({
        ...prevState,
        forzarActualizarHistoral: true,
      }));
    });

    this.#socket.on('reconexion-webchat', () => {
      this.#setEstado((prevState) => ({
        ...prevState,
        forzarActualizarHistoral: true,
      }));
    });

    this.#socket.on('registrar-webchat', (datos) => {
      const objetoDatos = JSON.parse(datos);
      this.#setCookie('botaidWebchatToken', objetoDatos.token);
      this.#setEstado((prevState) => ({
        ...prevState,
        token: objetoDatos.token,
      }));
    });

    this.#socket.on('respuestaObtenerCliente-webchat', (datos) => {
      const objetoDatos = JSON.parse(datos);
      this.#setEstado((prevState) => ({
        ...prevState,
        idCliente: objetoDatos.idCliente,
      }));
    });

    this.#socket.on('respuestaBuscarHistorialConversacion-webchat', (datos) => {
      const objetoDatos = JSON.parse(datos);
      this.#setEstado((prevState) => ({
        ...prevState,
        sesiones: objetoDatos.sesiones,
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

  obtenerCliente = ({ idNegocio, idCanal, token }) => {
    this.#socket.emit(
      'webchat-obtenerCliente',
      JSON.stringify({ idNegocio, idCanal, token })
    );
  };

  buscarHistorialConversacion = (data) => {
    this.#socket.emit(
      'webchat-buscarHistorialConversacion',
      JSON.stringify(data)
    );
  };
}

export default AdministradorConexion;
