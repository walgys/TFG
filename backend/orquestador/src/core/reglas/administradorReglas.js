const { AGREGAR_AL_CARRITO } = require('./agregarAlCarrito');
const { DECIR_INMEDIATAMENTE } = require('./decirInmediatamente');
const { GUARDAR_VARIABLE } = require('./guardarVariable');
const { INICIAR_CARRITO } = require('./iniciarCarrito');
const { IR_INTENCION } = require('./irIntencion');
const { MENU } = require('./menu');
const { PREGUNTAR } = require('./preguntar');
const { QUITAR_DEL_CARRITO } = require('./quitarDelCarrito');
const { RESPUESTA_MENU } = require('./respuestaMenu');
const { RESPUESTA_PREGUNTA } = require('./respuestaPregunta');
const { TERMINAR_COMPRA } = require('./terminarCompra');
class AdministradorReglas {
  static #instancia;
  #reglas = [];
  constructor() {
    this.#reglas = {
      DECIR_INMEDIATAMENTE: () => new DECIR_INMEDIATAMENTE(),
      IR_INTENCION: () => new IR_INTENCION(),
      MENU: () => new MENU(),
      RESPUESTA_MENU: () => new RESPUESTA_MENU(),
      INICIAR_CARRITO: () => new INICIAR_CARRITO(),
      AGREGAR_AL_CARRITO: () => new AGREGAR_AL_CARRITO(),
      QUITAR_DEL_CARRITO: () => new QUITAR_DEL_CARRITO(),
      TERMINAR_COMPRA: () => new TERMINAR_COMPRA(),
      GUARDAR_VARIABLE: () => new GUARDAR_VARIABLE(),
      PREGUNTAR: () => new PREGUNTAR(),
      RESPUESTA_PREGUNTA: () => new RESPUESTA_PREGUNTA(),
    };
  }

  static getInstancia() {
    if (!this.#instancia) {
      this.#instancia = new AdministradorReglas();
    }
    return this.#instancia;
  }

  buscarRegla = (reglaABuscar) => {
    return this.#reglas[reglaABuscar]();
  };
}

module.exports = { AdministradorReglas };
