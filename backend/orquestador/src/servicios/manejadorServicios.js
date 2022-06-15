const { AdministradorEntidades } = require('../core/administradorEntidades');
const { SERVICIOS } = require('../utilitarios/configuracion');
const { ApiConsola } = require('./apiConsola');
const { ManejadorDatosExternos } = require('./manejadorDatosExternos');
const { ManejadorDatosInternos } = require('./manejadorDatosInternos');
const { ManejadorWebchat } = require('./manejadorWebchat');
const { ServicioColasAtencion } = require('./servicioColasAtencion');
const { ServicioColasMensajes } = require('./servicioColasMensajes');
const { ServicioPLN } = require('./servicioPLN');

class ManejadorServicios {
  static #instancia;
  constructor() {
    const manejadorDatosInternos = ManejadorDatosInternos.getInstancia();
    const manejadorDatosExternos = ManejadorDatosExternos.getInstancia();
    const servicioPLN = ServicioPLN.getInstancia();
    const servicioColasMensajes = ServicioColasMensajes.getInstancia();
    const servicioColasAtencion = ServicioColasAtencion.getInstancia();
    const manejadorWebchat = ManejadorWebchat.getInstancia();
    const apiConsola = ApiConsola.getInstancia();
    const administradorEntidades = AdministradorEntidades.getInstancia();
    this.servicios = {
      manejadorDatosInternos,
      manejadorDatosExternos,
      servicioPLN,
      servicioColasMensajes,
      servicioColasAtencion,
      manejadorWebchat,
      apiConsola,
      administradorEntidades,
    };
    this.configurarServicios();
  }
  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new ManejadorServicios();
    }
    return this.#instancia;
  }

  configurarServicios = () => {
    this.servicios.manejadorWebchat.configurar(
      this.servicios.manejadorDatosInternos,
      this.servicios.administradorEntidades
    );
    this.servicios.administradorEntidades.configurar(
      this.servicios.manejadorDatosInternos
    );
  };
}

module.exports = { ManejadorServicios };
