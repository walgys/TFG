import ManejadorDatosInternos from '../servicios/manejadorDatosInterno';

class AdministradorEntidades {
  constructor() {
    this.datosInternos = ManejadorDatosInternos.getInstance();
  }

  obtenerAgente = (idAgente) => {};

  obtenerCanalComunicacion = (idCanalComunicacion) => {};

  obtenerNegocio = (idNegocio) => {};

  obtenerIntencion = (idIntencion) => {};

  obtenerCliente = (idCliente) => {};
}

exports.AdministradorEntidades;
