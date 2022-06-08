const { ServicioColasAtencion } = require('./servicioColasAtencion');
const { ServicioColasMensajes } = require('./servicioColasMensajes');
const { ServicioPLN } = require('./servicioPLN');

const servicios = {
  servicioPLN: ServicioPLN,
  servicioColasMensajes: ServicioColasMensajes,
  servicioColasAtencion: ServicioColasAtencion,
};

const plataformas = {
  MESSENGER: 'MESSENGER',
  TELEGRAM: 'TELEGRAM',
  WEBCHAT: 'WEBCHAT',
};

module.exports = { servicios, plataformas };
