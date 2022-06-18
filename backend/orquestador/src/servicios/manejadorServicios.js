const { AdministradorEntidades } = require('../core/administradorEntidades');
const { OrquestadorMensajes } = require('../core/orquestadorMensajes');
const {
  ProcesadorMensajesEntrantes,
} = require('../core/procesadorMensajesEntrantes');
const { ApiConsola } = require('./apiConsola');
const { ManejadorDatosExternos } = require('./manejadorDatosExternos');
const { ManejadorDatosInternos } = require('./manejadorDatosInternos');
const { ManejadorWebchat } = require('./manejadorWebchat');
const { ServicioColasAtencion } = require('./servicioColasAtencion');
const { ServicioColasMensajes } = require('./servicioColasMensajes');
const { ServicioPLN } = require('./servicioPLN');
const { VerificadorTokens } = require('./verificadorTokens');

class ManejadorServicios {
  static #instancia;
  constructor() {
    const manejadorDatosInternos = ManejadorDatosInternos.getInstancia();
    const manejadorDatosExternos = ManejadorDatosExternos.getInstancia();
    const servicioPLN = ServicioPLN.getInstancia();
    const servicioColasMensajes = ServicioColasMensajes.getInstancia();
    const servicioColasAtencion = ServicioColasAtencion.getInstancia();
    //const manejadorWebchat = ManejadorWebchat.getInstancia();
    const procesadorMensajesEntrantes =
      ProcesadorMensajesEntrantes.getInstancia();
    const apiConsola = ApiConsola.getInstancia();
    const administradorEntidades = AdministradorEntidades.getInstancia();
    const verificadorTokens = VerificadorTokens.getInstancia();
    const orquestadorMensajes = OrquestadorMensajes.getInstancia(50, 5);

    this.servicios = {
      manejadorDatosInternos,
      manejadorDatosExternos,
      servicioPLN,
      servicioColasMensajes,
      servicioColasAtencion,
      apiConsola,
      procesadorMensajesEntrantes,
      administradorEntidades,
      verificadorTokens,
      orquestadorMensajes,
      manejadorServicios: this,
    };

    setTimeout(this.configurarServicios, 1000);
    console.log('ManejadorServicios');
  }
  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorServicios();
    }
    return this.#instancia;
  }

  configurarServicios = async () => {
    await this.servicios.administradorEntidades.configurar(
      this.servicios.manejadorDatosInternos
    );
    await this.servicios.apiConsola.configurar(
      this.servicios.manejadorDatosInternos,
      this.servicios.verificadorTokens
    );

    /*await this.servicios.orquestadorMensajes.configurar(
      this.servicios.servicioColasMensajes,
      this.servicios.administradorEntidades,
      this.servicios.manejadorDatosExternos,
      this.servicios.manejadorDatosInternos,
      this.servicios.servicioPLN,
      'orquestadorManejadorDialogos'
    );*/

    await this.servicios.procesadorMensajesEntrantes.configurar(
      this.servicios.servicioColasMensajes,
      'mensajeEntrante'
    );
    /*await this.servicios.manejadorWebchat.configurar({
      manejadorDatosInternos: this.servicios.manejadorDatosInternos,
      administradorEntidades: this.servicios.administradorEntidades,
      verificadorTokens: this.servicios.verificadorTokens,
      orquestadorMensajes: this.servicios.orquestadorMensajes,
    });
    */
  };
}

module.exports = { ManejadorServicios };
