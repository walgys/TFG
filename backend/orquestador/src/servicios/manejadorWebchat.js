const io = require('socket.io');
class ManejadorWebchat {
  static #instancia;
  datosInternos;
  administradorEntidades;
  constructor() {
    this.datosInternos;
    this.administradorEntidades;
    this.websocket = new io.Server(9000, {
      cors: {
        origin: '*',
      },
    });

    this.websocket.on('connection', this.#procesarMensajeWebsocket);
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorWebchat();
    }
    return this.#instancia;
  }

  configurar = (manejadorDatosInternos, administradorEntidades) => {
    this.datosInternos = manejadorDatosInternos;
    this.administradorEntidades = administradorEntidades;
  };

  #procesarMensajeWebsocket = (client) => {
    console.log('someone connected');

    client.on('webchat-mensajeEntrante', (data) => {
      const parsedData = JSON.parse(data);
      console.log(`event: webchat-mensajeEntrante, data: ${data}`);
      client.emit(
        'recibiMensajeEntrante-webchat',
        JSON.stringify({ id: parsedData.id })
      );
    });

    client.on('webchat-nuevoCliente', () => {});

    client.on('webchat-buscarHistorialConversacion', async (data) => {
      const parsedData = JSON.parse(data);
      const { idCliente } = parsedData;
      const sesiones = await this.datosInternos.buscarHistorialConversacion(
        idCliente
      );
      client.emit(
        'respuestabuscarHistorialConversacion-webchat',
        JSON.stringify({ idCliente: idCliente, sesiones: sesiones })
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

module.exports = { ManejadorWebchat };
