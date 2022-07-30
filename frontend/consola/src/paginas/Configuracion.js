import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  colors,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../utilitarios/contextos';

const Configuracion = () => {
  const { estado, administradorConexion } = useContext(AppContext);
  const { usuario, negocio } = estado;
  const [opcionSeleccionada, setOpcionSeleccionada] = useState();
  const propiedadATexto = {
    configuracionDatosExternos: 'Datos Externos',
    variablesCliente: 'Variables',
    constantesCliente: 'Constantes',
  };

  const negocioCallback = useCallback((token) => {
    administradorConexion.enviarMensaje({
      tipo: 'obtenerNegocio',
      mensaje: {
        token: token,
      },
    });
  }, []);

  useEffect(() => {
    if (usuario.token !== '') {
      negocioCallback(usuario.token);
    }
  }, [usuario.token]);

  useEffect(() => {
    console.log(opcionSeleccionada);
  }, [opcionSeleccionada]);

  const seleccionarOpcion = (clave) => {
    console.log(clave);
    setOpcionSeleccionada(clave);
  };

  const obtenerEstructura = (opcionSeleccionada) => {
    const estructura = negocio[opcionSeleccionada];
    if (typeof estructura == 'object')
      return (
        <Accordion sx={{ minWidth: '300px', width: '100%' }} elevation={2}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{propiedadATexto[opcionSeleccionada]}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {Object.entries(estructura)
                .sort()
                .map(([clave, valor]) => {
                  if (typeof valor === 'string')
                    return (
                      <ListItem key={`${clave} (${valor})`}>
                        <ListItemButton
                          onClick={() => console.log(`${clave} (${valor})`)}
                        >
                          <Typography>{`${clave} (${valor})`}</Typography>
                        </ListItemButton>
                        <IconButton onClick={() => console.log('click')}>
                          <RemoveIcon sx={{ color: 'red' }} />
                        </IconButton>
                      </ListItem>
                    );
                  if (typeof valor === 'object')
                    return (
                      <Accordion
                        sx={{ minWidth: '300px', width: '100%' }}
                        elevation={2}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{clave}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List>
                            {Object.entries(valor)
                              .sort()
                              .map(([clave, valor]) => {
                                if (typeof valor === 'string')
                                  return (
                                    <ListItem key={`${clave} (${valor})`}>
                                      <ListItemButton
                                        onClick={() =>
                                          console.log(`${clave} (${valor})`)
                                        }
                                      >
                                        <Typography>{`${clave} (${valor})`}</Typography>
                                      </ListItemButton>
                                      <IconButton
                                        onClick={() => console.log('click')}
                                      >
                                        <RemoveIcon sx={{ color: 'red' }} />
                                      </IconButton>
                                    </ListItem>
                                  );
                              })}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    );
                })}
              <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  sx={{ backgroundColor: colors.blue[400] }}
                  onClick={() => console.log('click')}
                >
                  <AddIcon
                    sx={{
                      color: colors.common.white,
                    }}
                  />
                </IconButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      );
  };

  return (
    <Paper>
      <div style={{ display: 'flex', minHeight: '90vh' }}>
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '30px',
            flexDirection: 'column',
          }}
        >
          <Paper style={{ height: '100%', padding: '10px' }} elevation={2}>
            <List>
              <ListItem sx={{ justifyContent: 'center' }}>
                <Accordion
                  sx={{ minWidth: '300px', width: '100%' }}
                  elevation={2}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Configuración General</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {negocio &&
                        Object.keys(negocio)
                          .sort()
                          .map(
                            (clave) =>
                              clave !== 'id' && (
                                <ListItem key={clave}>
                                  <ListItemButton
                                    onClick={() => seleccionarOpcion(clave)}
                                  >
                                    <Typography>
                                      {propiedadATexto[clave]}
                                    </Typography>
                                  </ListItemButton>
                                </ListItem>
                              )
                          )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
            </List>
          </Paper>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '30px',
            flexDirection: 'column',
          }}
        >
          <Paper style={{ height: '100%', padding: '10px' }} elevation={2}>
            {opcionSeleccionada && obtenerEstructura(opcionSeleccionada)}
          </Paper>
        </div>
      </div>
    </Paper>
  );
};

export default Configuracion;
