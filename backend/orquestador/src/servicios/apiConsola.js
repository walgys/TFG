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
          'respuestaConsola',
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
        'respuestaConsola',
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
        const reglasEsquema = await this.#datosInternos.obtenerReglasEsquema();

        client.emit('respuestaConsola', JSON.stringify({ reglasEsquema: reglasEsquema }));
      }
    })

    client.on('obtenerAgentes', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;
      if (uid) {
        const agentes = await this.#datosInternos.obtenerAgentes();

        client.emit('respuestaConsola', JSON.stringify({ agentes: agentes }));
      }
    })

    client.on('crearDominio', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;

      if (uid) {
      
        const nuevoDominio = await this.#datosInternos.crearDominio({uid, topico: objetoDatos.dominio});
        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        await client.emit(
          'respuestaConsola',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            negocio: negocio,
          })
        );

      }
    })

    client.on('crearIntencion', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;

      if (uid) {
      
        const nuevaIntencion = await this.#datosInternos.crearIntencion({uid, intencion: objetoDatos.intencion});
        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        await client.emit(
          'respuestaConsola',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            negocio: negocio,
          })
        );

      }
    });

    client.on('crearRegla', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;

      if (uid) {
      
        let intencionActualizada = await this.#datosInternos.crearRegla({intencionId: objetoDatos.intencionId, regla: objetoDatos.regla});

        if(objetoDatos.regla.tipo === 'MENU'){
          intencionActualizada = await this.#datosInternos.crearRegla({intencionId: objetoDatos.intencionId, regla: {tipo: 'RESPUESTA_MENU'}});
        }

        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        await client.emit(
          'respuestaConsola',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            intencionActualizada,
            negocio: negocio,
          })
        );

      }
    })

    client.on('actualizarIntencion', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;

      if (uid) {
      
        const intencionActualizada= await this.#datosInternos.actualizarIntencion({intencion: objetoDatos.intencion});
        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        await client.emit(
          'respuestaConsola',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            intencionActualizada,
            negocio: negocio,
          })
        );

      }
    })

    client.on('eliminarDominio', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;

      if (uid) {
      
        await this.#datosInternos.eliminarDominio({idDominio: objetoDatos.dominio});
        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        await client.emit(
          'respuestaObtenerDominiosEIntenciones',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            negocio: negocio,
          })
        );

      }
    })

    client.on('eliminarIntencion', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const decodificado = await this.#verificadorTokens.verificarTokenFB(
        objetoDatos.token
      );
      const uid = decodificado?.user_id;

      if (uid) {
      
        await this.#datosInternos.eliminarIntencion({idIntencion: objetoDatos.intencion});
        const { dominiosEIntenciones, negocio } =
          await this.#datosInternos.obtenerDominiosEIntenciones(uid);
        await client.emit(
          'respuestaObtenerDominiosEIntenciones',
          JSON.stringify({
            dominiosEIntenciones: dominiosEIntenciones,
            negocio: negocio,
          })
        );

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
