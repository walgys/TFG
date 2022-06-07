class CanalComunicacion {
  constructor(id, configuracion, comportamientoCanal) {
    this.id = id;
    this.configuracion = configuracion;
    this.comportamientoCanal = comportamientoCanal;
  }

  enviarMensaje = (mensaje) => this.comportamientoCanal.enviarMensaje(mensaje);

  procesarMensaje = (mensaje) =>
    this.comportamientoCanal.procesarMensaje(mensaje);

  obtenerPlataforma = () => this.comportamientoCanal.obtenerPlataforma(mensaje);

  obtenerConfiguracion = () => this.configuracion;

  obtenerIdCanal = () => this.id;
}
