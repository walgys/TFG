const io = require('socket.io');
const { v4: uuidv4 } = require('uuid');

class ManejadorWebchat {
  static #instancia;
  #verificadorTokens;
  #cantidadMensajes;
  #manejadorColasMensajes;
  #websocket;
  #colaMensajesSalientes = [];
  #clienteWS;

  constructor() {
    this.#websocket = new io.Server(9000, {
      cors: {
        origin: '*',
      },
    });
    console.log('ManejadorWebchat');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorWebchat();
    }
    return this.#instancia;
  }

  configurar = ({ manejadorColasMensajes, verificadorTokens, cantidad }) => {
    this.#manejadorColasMensajes = manejadorColasMensajes;
    this.#verificadorTokens = verificadorTokens;
    this.#cantidadMensajes = cantidad;
    this.#websocket.on('connection', this.#procesarMensajeWebsocket);
    setInterval(
      () =>
        this.#manejadorColasMensajes.obtenerMensajes({
          cantidad: this.#cantidadMensajes,
          callback: {
            id: uuidv4(),
            ejecutar: this.#encolarMensajes,
          },
        }),
      300
    );
    setInterval(() => this.#procesarMensajes(), 300);
  };

  #procesarMensajeWebsocket = (clienteWS) => {
    clienteWS.emit('reconexion-webchat', '');

    clienteWS.on('webchat-mensajeEntrante', (datos) => {
      clienteWS.emit('enviadoMensajeEntrante-webchat', datos);
      this.#manejadorColasMensajes.agregarMensaje({
        topico: 'mensajeEntrante',
        mensaje: { endpoint: 'webchat-mensajeEntrante', datos: datos },
      });
    });

    clienteWS.on('webchat-obtenerCliente', async (datos) => {
      this.#manejadorColasMensajes.agregarMensaje({
        topico: 'mensajeEntrante',
        mensaje: { endpoint: 'webchat-obtenerCliente', datos: datos },
      });
    });

    clienteWS.on('webchat-buscarHistorialConversacion', async (datos) => {
      this.#manejadorColasMensajes.agregarMensaje({
        topico: 'mensajeEntrante',
        mensaje: {
          endpoint: 'webchat-buscarHistorialConversacion',
          datos: datos,
        },
      });
    });

    clienteWS.on('heartbeat', () => {
      console.log('heartbeat');
      clienteWS.emit('heartbeat', '');
    });

    clienteWS.on('disconnect', () => {
      console.log('client disconnected');
    });
  };

  #encolarMensajes = (mensajes) => {
    this.#colaMensajesSalientes.push(...mensajes);
  };

  #procesarMensajes = () => {
    while (this.#colaMensajesSalientes.length > 0) {
      const mensajeSaliente = this.#colaMensajesSalientes.shift();
      const { endpoint, datos } = mensajeSaliente;
      const { idSocket, mensaje } = datos;
      this.#websocket.fetchSockets(idSocket).then((socket) => {
        socket[0].emit(endpoint, mensaje);
      });
    }
  };
}

module.exports = { ManejadorWebchat };
