class Negocio {
  constructor(id, configuracionDatosExternos) {
    this.id = id;
    this.configuracionDatosExternos = configuracionDatosExternos;
  }

  obtenerId = () => this.id;
  obtenerConfiguracionDatosExternos = () => this.configuracionDatosExternos;
}
