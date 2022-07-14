const io = require('socket.io');
class ApiConsola {
  static #instancia;
  #datosInternos;
  #verificadorTokens;
  constructor() {
    this.socket = new io.Server(8000, {
      cors: {
        origin: '*',
      },
    });
    console.log('ApiConsola');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ApiConsola();
    }
    return this.#instancia;
  }
  configurar = (datosInternos, verificadorTokens) => {
    this.#datosInternos = datosInternos;
    this.#verificadorTokens = verificadorTokens;
    this.socket.on('connection', this.procesarMensajeWebsocket);
  };

  procesarMensajeWebsocket = (client) => {
    console.log('someone connected');

    client.on('obtenerDominiosEIntenciones', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;
      if (uid) {
        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        client.emit(
          'respuestaObtenerDominiosEIntenciones',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            negocio: negocio,
          })
        );
      }
    });

    client.on('obtenerIntenciones', (data) => {
      const parsedData = JSON.parse(data);
      console.log(`event: mensajeConsolaEntrante, data: ${data}`);
      client.emit(
        'recibiMensajeConsolaEntrante',
        JSON.stringify({ id: parsedData.id })
      );
    });

    client.on('obtenerReglasEsquema', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;
      if (uid) {
      
        const reglasEsquema = await this.#datosInternos.buscarReglasEsquema();

        client.emit('respuestaObtenerReglasEsquema', JSON.stringify({ reglasEsquema: reglasEsquema }));
      }
    })

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
