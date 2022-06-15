class Agente {
  constructor(
    idAgente,
    idNegocio,
    nombre,
    email,
    alias,
    estado,
    configuracion
  ) {
    this.idAgente = idAgente;
    this.idNegocio = idNegocio;
    this.nombre = nombre;
    this.email = email;
    this.alias = alias;
    this.estado = estado;
    this.configuracion = configuracion;
  }

  obtenerEstado = () => this.estado;

  obtenerInformacion = () => {
    return {
      idAgente: this.idAgente,
      idNegocio: this.idNegocio,
      nombre: this.nombre,
      email: this.email,
      alias: this.alias,
    };
  };

  obtenerConfiguracion = () => this.configuracion;
}

exports.Agente;
