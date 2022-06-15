class Intencion {
  constructor(id, nombreIntencion, reglas, disparadores) {
    this.id = id;
    this.nombreIntencion = nombreIntencion;
    this.reglas = reglas;
    this.disparadores = disparadores;
  }

  obtenerId = () => this.id;
  obtenerNombre = () => this.nombreIntencion;
  obtenerReglas = () => this.reglas;
  obtenerDisparadores = () => this.disparadores;
}
