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
    this.#setEstado((prevState) => ({
      ...prevState,
      idSocket: this.#socket.id,
      forzarActualizarHistoral: true,
    }));

    this.#socket.on('reconexion-webchat', () => {
      this.#setEstado((prevState) => ({
        ...prevState,
        forzarActualizarHistoral: true,
      }));
    });

    this.#socket.on('enviadoMensajeEntrante-webchat', (datos) => {
      //confirmar recepción del mensaje
      const objetoDatos = JSON.parse(datos);
      const { id } = objetoDatos;
      this.#cambiarEstadoMensaje(id, 'enviado');
    });

    this.#socket.on('recibiMensajeEntrante-webchat', (datos) => {
      //confirmar recepción del mensaje

      const objetoDatos = JSON.parse(datos);
      const { id } = objetoDatos;
      this.#cambiarEstadoMensaje(id, 'recibido');
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

  obtenerCliente = (datos) => {
    this.#socket.emit('webchat-obtenerCliente', JSON.stringify(datos));
  };

  buscarHistorialConversacion = (data) => {
    this.#socket.emit(
      'webchat-buscarHistorialConversacion',
      JSON.stringify(data)
    );
  };

  #cambiarEstadoMensaje = (id, estado) => {
    this.#setEstado((prevState) => {
      const sesiones = prevState.sesiones.map((sesion, indice) => {
        if (indice === prevState.sesiones.length - 1) {
          const mensajes = sesion.mensajes.map((mensaje) => {
            if (mensaje.id === id) {
              return {
                ...mensaje,
                cuerpo: { ...mensaje.cuerpo, estado: estado },
              };
            } else {
              return mensaje;
            }
          });
          return { ...sesion, mensajes: mensajes };
        } else {
          return sesion;
        }
      });
      return { ...prevState, sesiones: sesiones };
    });
  };
}

export default AdministradorConexion;
