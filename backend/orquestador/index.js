const { ManejadorDatosInternos } = require('./servicios/manejadorDatosInterno');

const main = async () => {
  const manejador = ManejadorDatosInternos.getInstancia();

  const intenciones = await manejador.buscarIntenciones('MiTienda');

  intenciones.docs.forEach((intencion) => console.log(intencion.data()));
};

main();
