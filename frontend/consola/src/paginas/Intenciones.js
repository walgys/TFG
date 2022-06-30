import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  Paper,
  AccordionSummary,
  ListItemButton,
  Button,
  IconButton,
  colors,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { AppContext } from '../utilitarios/contextos';
import { useCallback } from 'react';
import { useState } from 'react';
import ModalPropiedades from '../componentes/ModalPropiedades';

const Intenciones = (props) => {
  const { estado, administradorConexion } = useContext(AppContext);
  const { usuario, dominiosEIntenciones } = estado;
  const [intencionEdicion, setIntencionEdicion] = useState();
  const [configuracion, setConfiguracion] = useState([]);
  const [estadoModal, setEstadoModal] = useState(false);
  const [propiedadModal, setPropiedadModal] = useState({});
  const propiedadesInmutables = [
    'id',
    'intencion',
    'dominio',
    'topico',
    'negocio',
  ];

  useEffect(() => {
    if (intencionEdicion) {
      const configuracion = Object.entries(intencionEdicion)
        .map(([llave, valor]) => ({ llave: llave, valor: valor }))
        .filter(
          (propiedad) =>
            !Array.isArray(propiedad.valor) &&
            !propiedadesInmutables.includes(propiedad.llave)
        );
      setConfiguracion(configuracion);
    }
  }, [intencionEdicion]);

  const obtenerDominiosCallback = useCallback(
    () =>
      administradorConexion.obtenerDominiosEIntenciones({
        token: usuario.token,
      }),
    []
  );

  useEffect(() => {
    obtenerDominiosCallback();
  }, []);

  const enviarMensajeHandler = () => {
    console.log('aprete');
  };

  const cambiarEstadoModal = (propiedad) => {
    setPropiedadModal(propiedad);
    setEstadoModal(!estadoModal);
  };

  const cerrar = () => {
    setEstadoModal(false);
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
          <Paper style={{ height: '100%', padding: '10px' }}>
            <Typography variant="h4" align={'center'}>
              Dominios
            </Typography>

            <List>
              {dominiosEIntenciones?.map((dominio) => (
                <ListItem sx={{ justifyContent: 'center' }} key={dominio?.id}>
                  <Accordion sx={{ minWidth: '300px', width: '100%' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{dominio?.topico}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {dominio?.intenciones?.map((intencion) => (
                          <ListItemButton
                            key={intencion.id}
                            onClick={() => setIntencionEdicion(intencion)}
                          >
                            <Typography>{intencion?.intencion}</Typography>
                          </ListItemButton>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              ))}
              <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton sx={{ backgroundColor: colors.blue[400] }}>
                  <AddIcon
                    sx={{
                      color: colors.common.white,
                    }}
                  />
                </IconButton>
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
          <Paper style={{ height: '100%', padding: '10px' }}>
            {intencionEdicion && (
              <List>
                <Typography variant="h5" align={'center'}>
                  {intencionEdicion.intencion}
                </Typography>
                <ListItem sx={{ justifyContent: 'center' }}>
                  <Accordion sx={{ minWidth: '300px', width: '100%' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Disparadores</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {intencionEdicion?.disparadores?.map((disparador) => (
                          <ListItem
                            key={disparador}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                            onClick={() => console.log(disparador)}
                          >
                            <Typography>{disparador}</Typography>
                            <IconButton>
                              <RemoveIcon sx={{ color: 'red' }} />
                            </IconButton>
                          </ListItem>
                        ))}

                        <ListItem
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <IconButton
                            sx={{ backgroundColor: colors.blue[400] }}
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
                </ListItem>
                <ListItem sx={{ justifyContent: 'center' }}>
                  <Accordion sx={{ minWidth: '300px', width: '100%' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Reglas</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {intencionEdicion?.reglas?.map((regla) => (
                          <ListItemButton
                            key={regla.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                            onClick={() => cambiarEstadoModal(regla)}
                          >
                            <Typography>{regla.tipo}</Typography>
                            <IconButton>
                              <RemoveIcon sx={{ color: 'red' }} />
                            </IconButton>
                          </ListItemButton>
                        ))}
                        <ListItem
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <IconButton
                            sx={{ backgroundColor: colors.blue[400] }}
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
                </ListItem>
                <ListItem sx={{ justifyContent: 'center' }}>
                  <Accordion sx={{ minWidth: '300px', width: '100%' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Configuración</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {configuracion?.map((propiedad) => (
                          <ListItemButton
                            key={propiedad.llave}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                            onClick={() => console.log(propiedad.valor)}
                          >
                            <Typography>{propiedad.llave}</Typography>
                            <IconButton>
                              <RemoveIcon sx={{ color: 'red' }} />
                            </IconButton>
                          </ListItemButton>
                        ))}
                        <ListItem
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <IconButton
                            sx={{ backgroundColor: colors.blue[400] }}
                          >
                            <AddIcon
                              sx={{
                                color: colors.common.white,
                              }}
                            />
                          </IconButton>
                        </ListItem>{' '}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              </List>
            )}
          </Paper>
        </div>
      </div>
      <ModalPropiedades
        estadoModal={estadoModal}
        cerrar={cerrar}
        propiedadModal={propiedadModal}
      />
    </Paper>
  );
};

export default Intenciones;
