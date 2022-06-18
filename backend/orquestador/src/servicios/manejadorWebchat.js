const io = require('socket.io');
const moment = require('moment');
class ManejadorWebchat {
  static #instancia;
  #datosInternos;
  #administradorEntidades;
  #verificadorTokens;
  #orquestadorMensajes;
  #colaMensajes;
  #websocket;
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

  configurar = ({
    manejadorDatosInternos,
    administradorEntidades,
    verificadorTokens,
    orquestadorMensajes,
  }) => {
    this.#datosInternos = manejadorDatosInternos;
    this.#administradorEntidades = administradorEntidades;
    this.#verificadorTokens = verificadorTokens;
    this.#orquestadorMensajes = orquestadorMensajes;
    this.#websocket.on('connection', this.#procesarMensajeWebsocket);
    setInterval(() => this.#procesarCola, 2);
  };

  #esTokenValido = (token) => {
    const tokenDecofificado =
      this.#verificadorTokens.verificarTokenPlataforma(token);
    if (tokenDecofificado.error) {
      this.#clienteWS.emit('token-error-webchat', tokenDecofificado.error);
      return false;
    }
    return tokenDecofificado;
  };

  #procesarMensajeWebsocket = (clienteWS) => {
    clienteWS.emit('reconexion-webchat', '');
    this.#clienteWS = clienteWS;

    this.#clienteWS.on('webchat-mensajeEntrante', (datos) => {
      this.#colaMensajes.push({
        endpoint: 'webchat-mensajeEntrante',
        datos: datos,
      });
    });

    clienteWS.on('webchat-obtenerCliente', async (datos) => {
      this.#colaMensajes.push({
        endpoint: 'webchat-obtenerCliente',
        datos: datos,
      });
    });

    clienteWS.on('webchat-buscarHistorialConversacion', async (datos) => {
      this.#colaMensajes.push({
        endpoint: 'webchat-buscarHistorialConversacion',
        datos: datos,
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

  #procesarMensajeEntrante = async (datos) => {
    const objetoDatos = JSON.parse(datos);
    const { texto, token, idSesion, idCliente, origen, id } = objetoDatos;

    const tokenDecofificado = this.#esTokenValido(token);
    if (tokenDecofificado) {
      const { idNegocio } = tokenDecofificado;
      let sesion = await this.#datosInternos.buscarSesion({
        idSesion,
        idCliente,
      });

      if (sesion) {
        const validSesion =
          moment() - moment().unix(sesion?.fecha?._seconds) > 0 ? true : false;
        if (!validSesion) {
          const nuevaSesion = await this.#datosInternos.crearSesion(idCliente);
          if (nuevaSesion) sesion = nuevaSesion;
        }
      }

      this.#datosInternos.agregarMensaje({
        texto: texto,
        idSesion: sesion.id,
        idCliente: idCliente,
        origen: origen,
      });

      this.#clienteWS.emit(
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
  };

  #procesarObtenerCliente = async (datos) => {
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

    const tokenDecofificado = this.#esTokenValido(objetoDatos.token, clienteWS);
    if (tokenDecofificado) {
      clienteWS.emit(
        'respuestaObtenerCliente-webchat',
        JSON.stringify({ idCliente: tokenDecofificado.idCliente })
      );
    }
  };

  #procesarBuscarHistorialConversacion = async (datos) => {
    const objetoDatos = JSON.parse(datos);
    const tokenDecofificado = this.#esTokenValido(objetoDatos.token, clienteWS);
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
          const nuevaSesion = await this.#datosInternos.crearSesion(idCliente);
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
  };

  #procesarCola = () => {
    if (this.#colaMensajes.length > 0) {
      const mensaje = this.#colaMensajes;
    }
  };
}

module.exports = { ManejadorWebchat };
