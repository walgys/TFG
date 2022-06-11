const { ApiConsola } = require('./servicios/apiConsola');
const { ManejadorDatosInternos } = require('./servicios/manejadorDatosInterno');
const { ServicioColasMensajes } = require('./servicios/servicioColasMensajes');
const { ServicioPLN } = require('./servicios/servicioPLN');

const main = async () => {
  const apiConsola = new ApiConsola();
  const servicioColasMensajes = new ServicioColasMensajes();
  setInterval(() => servicioColasMensajes.obtenerMensaje(), 1000);
  /*let id = 1;
  setInterval(() => servicioColasMensajes.obtenerMensaje(), 1000);
  setInterval(() => {
    servicioColasMensajes.agregarMensaje({ id: id, texto: 'Hola querido' });
    id += 1;
  }, 1000);
  
   const manejador = ManejadorDatosInternos.getInstancia();

  const intenciones = await manejador.buscarIntenciones('MiTienda');

  intenciones.docs.forEach((intencion) => console.log(intencion.data()));

  

  

  servicioColasMensajes.agregarMensaje('Hola como estas ?');
  setInterval(() => servicioColasMensajes.heartbeat(), 5000);
  
    const req = async () => {
      const servicioPLN = new ServicioPLN();
      const data = {
        idNegocio: 'MiTienda',
        contexto: {
          topico: 'inicio',
        },
        clienteDice: 'lista de productos',
      };
      const result = await servicioPLN.buscarSimilitud(data, 'buscarSimilitud');
      console.log(JSON.stringify(result));
    };

    await req();
    */
};

main();
