const { ServicioColasAtencion } = require('./servicioColasAtencion');
const { ServicioColasMensajes } = require('./servicioColasMensajes');
const { ServicioPLN } = require('./servicioPLN');

const servicios = {
  servicioPLN: ServicioPLN,
  servicioColasMensajes: ServicioColasMensajes,
  servicioColasAtencion: ServicioColasAtencion,
};

module.exports = { servicios };
