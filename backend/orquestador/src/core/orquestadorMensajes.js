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
  #administradorReglas;

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

  configurar = ({
    servicioColasMensajes,
    administradorEntidades,
    manejadorDatosExternos,
    manejadorDatosInternos,
    servicioPLN,
    topico,
    administradorReglas,
  }) => {
    this.#servicioColasMensajes = servicioColasMensajes;
    this.#administradorEntidades = administradorEntidades;
    this.#manejadorDatosExternos = manejadorDatosExternos;
    this.#manejadorDatosInternos = manejadorDatosInternos;
    this.#administradorReglas = administradorReglas;
    this.#servicioPLN = servicioPLN;

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
        const manejadorMD = new ManejadorDialogos({
          administradoEntidades: this.#administradorEntidades,
          administradorDatosExternos: this.#manejadorDatosExternos,
          manejadorDatosInternos: this.#manejadorDatosInternos,
          servicioPLN: this.#servicioPLN,
          id: uuid,
          mensaje: this.#colaMensajes.shift(),
          terminar: this.terminar,
          administradorReglas: this.#administradorReglas,
          servicioColasMensajes: this.#servicioColasMensajes,
        });
        this.#colaMD.push({ uuid: uuid, manejadorMD: manejadorMD });
      }
    }
  };

  terminar = async ({ uuid, resultado }) => {
    console.log('termino ', uuid);
    console.log('resultado: ', resultado);
    const newCola = await this.#colaMD.filter((MD) => MD.uuid == uuid);
    this.#colaMD = [...newCola];
    console.log(this.#colaMD);
  };
}

module.exports = { OrquestadorMensajes };
