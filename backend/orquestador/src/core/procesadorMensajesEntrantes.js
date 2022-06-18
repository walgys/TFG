const { StaticPool } = require('node-worker-threads-pool');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class ProcesadorMensajesEntrantes {
  static #instancia;
  #servicioColasMensajes;
  #poolTareas;
  #colaMensajes = [];
  #cantidadMensajes;

  constructor(cantidadMensajes) {
    this.#cantidadMensajes = cantidadMensajes;
    this.#poolTareas = new StaticPool({
      size: 4,
      task: path.resolve(__dirname, './tareas/procesarMensajeEntrante.js'),
    });
    console.log('OrquestadorMensajes');
  }

  static getInstancia(cantidadMensajes) {
    if (!this.#instancia) {
      this.#instancia = new ProcesadorMensajesEntrantes(cantidadMensajes);
    }
    return this.#instancia;
  }

  configurar = (servicioColasMensajes, topico) => {
    this.#servicioColasMensajes = servicioColasMensajes;
    setInterval(
      () =>
        this.#servicioColasMensajes.obtenerMensajes({
          cantidad: this.#cantidadMensajes,
          callback: {
            id: uuidv4(),
            ejecutar: this.#encolarMensajes,
          },
          topico,
        }),
      300
    );
    setInterval(() => this.#procesarMensajes(), 300);
  };

  #encolarMensajes = (mensajes) => {
    this.#colaMensajes.push(...mensajes);
  };

  #procesarMensajes = () => {
    while (this.#colaMensajes.length > 0) {
      this.#poolTareas
        .exec(this.#colaMensajes.shift())
        .then((result) => console.log(result))
        .catch((ex) => console.log('error: ', ex));
    }
  };
}

module.exports = { ProcesadorMensajesEntrantes };
