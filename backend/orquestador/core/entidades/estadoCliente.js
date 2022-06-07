class EstadoCliente {
  constructor(
    intencionEnEjecucion,
    ultimaRegla,
    estadoUltimaRegla,
    ultimoMensaje,
    variablesCliente
  ) {
    this.intencionEnEjecucion = intencionEnEjecucion;
    this.ultimaRegla = ultimaRegla;
    this.estadoUltimaRegla = estadoUltimaRegla;
    this.ultimoMensaje = ultimoMensaje;
    this.variablesCliente = variablesCliente;
  }

  obtenerEstado = () => {
    return {
      intencionEnEjecucion: this.intencionEnEjecucion,
      ultimaRgla: this.ultimaRegla,
      estaUltimaRegla: this.ultimaRegla,
      ultimoMensaje: this.ultimoMensaje,
      variablesCliente: this.variablesCliente,
    };
  };

  setIntencionEnEjecucion = (nuevaIntencionEnEjecucion) => {
    this.intencionEnEjecucion = nuevaIntencionEnEjecucion;
  };

  setUltimaRegla = (nuevaUltimaRegla) => {
    this.ultimaRegla = nuevaUltimaRegla;
  };

  setEstadoUltimaRegla = (nuevoEstadoUltimaRegla) => {
    this.estadoUltimaRegla = nuevoEstadoUltimaRegla;
  };

  setUltimoMensaje = (nuevoUltimoMensaje) => {
    this.ultimoMensaje = nuevoUltimoMensaje;
  };

  setVariablesCliente = (nuevasVariablesCliente) => {
    this.variablesCliente = nuevasVariablesCliente;
  };
}
