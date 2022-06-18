const { ManejadorWebchat } = require('./canales/manejadorWebchat');
const { ServicioColasMensajes } = require('./servicios/servicioColasMensajes');
const { VerificadorTokens } = require('./servicios/verificadorTokens');

const main = async () => {
  const manejadorWebchat = ManejadorWebchat.getInstancia();
  const manejadorColasMensajes = ServicioColasMensajes.getInstancia();
  const verificadorTokens = VerificadorTokens.getInstancia();
  manejadorWebchat.configurar({
    manejadorColasMensajes: manejadorColasMensajes,
    verificadorTokens: verificadorTokens,
    cantidad: 50,
  });
};
main().catch((ex) => console.log(ex));
