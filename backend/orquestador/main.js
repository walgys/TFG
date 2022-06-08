const { ManejadorDatosInternos } = require('./servicios/manejadorDatosInterno');
const { ServicioColasMensajes } = require('./servicios/servicioColasMensajes');

const main = async () => {
  /* const manejador = ManejadorDatosInternos.getInstancia();

  const intenciones = await manejador.buscarIntenciones('MiTienda');

  intenciones.docs.forEach((intencion) => console.log(intencion.data()));

  */

  const servicioColasMensajes = new ServicioColasMensajes();

  servicioColasMensajes.agregarMensaje('Hola como estas ?');
  setInterval(() => servicioColasMensajes.heartbeat(), 5000);
};

main();
