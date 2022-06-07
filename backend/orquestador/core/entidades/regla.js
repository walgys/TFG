class Regla {
  constructor(id, configuracionRegla, comportamientoRegla) {
    this.id = id;
    this.configuracionRegla = configuracionRegla;
    this.comportamientoRegla = comportamientoRegla;
  }

  obtenerId = () => this.id;

  ejecutarRegla = () =>
    this.comportamientoRegla.ejecutarRegla(this.comportamientoRegla);
}
