const { v4: uuidv4 } = require('uuid');
const { ManejadorDialogos } = require('./manejadorDialogos');
class OrquestadorMensajes {
  static #instancia;
  #servicioColasMensajes;
  #administradorEntidades;
  #manejadorDatosExternos;
  #manejadorDatosInternos;
  #servicioPLN;
  #colaMD = [];
  #colaMensajes = [];
  #cantidadMensajes;
  #cantidadInstanciasMD;

  constructor(cantidadMensajes, cantidadInstanciasMD) {
    this.#cantidadMensajes = cantidadMensajes;
    this.#cantidadInstanciasMD = cantidadInstanciasMD;
    console.log('OrquestadorMensajes');
  }

  static getInstancia(cantidadMensajes, cantidadInstanciasMD) {
    if (!this.#instancia) {
      this.#instancia = new OrquestadorMensajes(
        cantidadMensajes,
        cantidadInstanciasMD
      );
    }
    return this.#instancia;
  }

  configurar = (
    servicioColasMensajes,
    administradorEntidades,
    manejadorDatosExternos,
    manejadorDatosInternos,
    servicioPLN
  ) => {
    this.#servicioColasMensajes = servicioColasMensajes;
    this.#administradorEntidades = administradorEntidades;
    this.#manejadorDatosExternos = manejadorDatosExternos;
    this.#manejadorDatosInternos = manejadorDatosInternos;
    this.#servicioPLN = servicioPLN;

    setInterval(
      () =>
        this.#servicioColasMensajes.obtenerMensajes(this.#cantidadMensajes, {
          id: uuidv4(),
          ejecutar: this.#encolarMensajes,
        }),
      300
    );
    setInterval(() => this.#procesarMensajes(), 300);
  };

  #encolarMensajes = (mensajes) => {
    this.#colaMensajes.push(...mensajes);
  };

  encolarMensaje = (mensaje) => {
    this.#colaMensajes.push(mensaje);
  };

  #procesarMensajes = () => {
    if (
      this.#colaMensajes.length > 0 &&
      this.#colaMD.length <= this.#cantidadInstanciasMD
    ) {
      while (
        this.#colaMensajes.length > 0 &&
        this.#colaMD.length <= this.#cantidadInstanciasMD
      ) {
        const uuid = uuidv4();
        const manejadorMD = new ManejadorDialogos(
          this.#administradorEntidades,
          this.#manejadorDatosExternos,
          this.#manejadorDatosInternos,
          this.#servicioPLN,
          uuid,
          this.#colaMensajes.shift(),
          this.terminar
        );
        this.#colaMD.push({ uuid: uuid, manejadorMD: manejadorMD });
      }
    }
  };

  terminar = async ({ uuid, resultado }) => {
    console.log('termino ', uuid);
    console.log('resultado: ', resultado);
    this.#colaMD = await this.#colaMD.filter((MD) => MD.uuid !== uuid);
  };
}

module.exports = { OrquestadorMensajes };
