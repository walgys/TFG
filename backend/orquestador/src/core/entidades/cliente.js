class Cliente {
  constructor(id, canalComunicacion, estadoCliente) {
    this.id = id;
    this.canalComunicacion = canalComunicacion;
    this.estadoCliente = estadoCliente;
  }

  obtenerEstado = () => this.estadoCliente;

  obtenerCanalComunicacion = () => this.canalComunicacion;

  obtenerIdCliente = () => this.id;
}
