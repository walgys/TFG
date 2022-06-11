const { ManejadorDatosInternos } = require('./manejadorDatosInterno');
const io = require('socket.io');
class ApiConsola {
  _instancia;

  constructor() {
    this.datosInternos = ManejadorDatosInternos.getInstancia();
    this.websocket = new io.Server(8000, {
      cors: {
        origin: '*',
      },
    });

    this.websocket.on('connection', this.procesarMensajeWebsocket);
  }

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ApiConsola();
    }
    return this._instancia;
  }

  procesarMensajeWebsocket = (client) => {
    console.log('someone connected');

    client.on('mensajeConsolaEntrante', (data) => {
      const parsedData = JSON.parse(data);
      console.log(`event: mensajeConsolaEntrante, data: ${data}`);
      client.emit(
        'recibiMensajeConsolaEntrante',
        JSON.stringify({ id: parsedData.id })
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

module.exports = { ApiConsola };
