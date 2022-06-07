import ManejadorDatosInternos from '../servicios/manejadorDatosInterno';

class AdministradorEntidades {
  constructor() {
    this.datosInternos = ManejadorDatosInternos.getInstance();
  }

  crearAgente = () => {};
}

exports.AdministradorEntidades;
