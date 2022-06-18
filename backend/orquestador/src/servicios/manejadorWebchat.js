const io = require('socket.io');
const moment = require('moment');
class ManejadorWebchat {
  static #instancia;
  #datosInternos;
  #administradorEntidades;
  #verificadorTokens;
  #orquestadorMensajes;
  constructor() {
    this.websocket = new io.Server(9000, {
      cors: {
        origin: '*',
      },
    });

    this.websocket.on('connection', this.#procesarMensajeWebsocket);
    console.log('ManejadorWebchat');
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorWebchat();
    }
    return this.#instancia;
  }

  configurar = (
    manejadorDatosInternos,
    administradorEntidades,
    verificadorTokens,
    orquestadorMensajes
  ) => {
    this.#datosInternos = manejadorDatosInternos;
    this.#administradorEntidades = administradorEntidades;
    this.#verificadorTokens = verificadorTokens;
    this.#orquestadorMensajes = orquestadorMensajes;
  };
  #esTokenValido = (token, clienteWS) => {
    const tokenDecofificado =
      this.#verificadorTokens.verificarTokenPlataforma(token);
    if (tokenDecofificado.error) {
      clienteWS.emit('token-error-webchat', tokenDecofificado.error);
      return false;
    }
    return tokenDecofificado;
  };

  #procesarMensajeWebsocket = (clienteWS) => {
    clienteWS.emit('reconexion-webchat', '');

    clienteWS.on('webchat-mensajeEntrante', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const { texto, token, idSesion, idCliente, origen, id } = objetoDatos;

      const tokenDecofificado = this.#esTokenValido(token, clienteWS);
      if (tokenDecofificado) {
        const { idNegocio } = tokenDecofificado;
        let sesion = await this.#datosInternos.buscarSesion({
          idSesion,
          idCliente,
        });

        if (sesion) {
          const validSesion =
            moment() - moment().unix(sesion?.fecha?._seconds) > 0
              ? true
              : false;
          if (!validSesion) {
            const nuevaSesion = await this.#datosInternos.crearSesion(
              idCliente
            );
            if (nuevaSesion) sesion = nuevaSesion;
          }
        }

        this.#datosInternos.agregarMensaje({
          texto: texto,
          idSesion: sesion.id,
          idCliente: idCliente,
          origen: origen,
        });

        clienteWS.emit(
          'recibiMensajeEntrante-webchat',
          JSON.stringify({ id: objetoDatos.id, estado: 'ok' })
        );

        this.#orquestadorMensajes.encolarMensaje({
          id: id,
          texto: texto,
          idNegocio: idNegocio,
          idSesion: sesion.id,
          idCliente: idCliente,
          origen: origen,
        });
      }
    });

    clienteWS.on('webchat-obtenerCliente', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      if (!objetoDatos.token || objetoDatos.token === '') {
        const idCliente = await this.#datosInternos.crearCliente(objetoDatos);
        const token = await this.#verificadorTokens.generarTokenWebchat({
          ...objetoDatos,
          idCliente: idCliente,
        });
        clienteWS.emit(
          'registrar-webchat',
          JSON.stringify({
            idCliente: idCliente,
            token: token,
          })
        );
        return;
      }

      const tokenDecofificado = this.#esTokenValido(
        objetoDatos.token,
        clienteWS
      );
      if (tokenDecofificado) {
        clienteWS.emit(
          'respuestaObtenerCliente-webchat',
          JSON.stringify({ idCliente: tokenDecofificado.idCliente })
        );
      }
    });

    clienteWS.on('webchat-buscarHistorialConversacion', async (datos) => {
      const objetoDatos = JSON.parse(datos);
      const tokenDecofificado = this.#esTokenValido(
        objetoDatos.token,
        clienteWS
      );
      if (tokenDecofificado) {
        const { idCliente } = objetoDatos;
        let sesiones = await this.#datosInternos.buscarHistorialConversacion(
          idCliente
        );
        if (sesiones.length == 0) {
          const intenciones = await this.#datosInternos.buscarIntencion(
            tokenDecofificado.idNegocio,
            'SALUDO INICIAL'
          );
          const mensaje = intenciones[0]?.reglas[0]?.configuracion?.texto;
          if (mensaje) {
            const nuevaSesion = await this.#datosInternos.crearSesion(
              idCliente
            );
            await this.#datosInternos.agregarMensaje({
              texto: mensaje,
              idSesion: nuevaSesion.id,
              idCliente: idCliente,
              origen: 'bot',
            });
            sesiones = await this.#datosInternos.buscarHistorialConversacion(
              idCliente
            );
          }
        }
        clienteWS.emit(
          'respuestaBuscarHistorialConversacion-webchat',
          JSON.stringify({ idCliente: idCliente, sesiones: sesiones })
        );
      }
    });

    clienteWS.on('heartbeat', () => {
      console.log('heartbeat');
      clienteWS.emit('heartbeat', '');
    });

    clienteWS.on('disconnect', () => {
      console.log('client disconnected');
    });
  };
}

module.exports = { ManejadorWebchat };
