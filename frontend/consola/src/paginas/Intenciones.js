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
  const { usuario, dominiosEIntenciones, reglasEsquema } = estado;
  const [intencionEdicion, setIntencionEdicion] = useState();
  const [configuracion, setConfiguracion] = useState([]);
  const [estadoModal, setEstadoModal] = useState(false);
  const [parametrosModal, setParametrosModal] = useState({});
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
    (token) => {
      administradorConexion.obtenerDominiosEIntenciones({
        token: token,
      });
      administradorConexion.obtenerReglasEsquema({
        token: token,
      });
    },
    []
  );

  useEffect(() => {
    if (usuario.token !== '') {
      obtenerDominiosCallback(usuario.token);
    }
    
  }, [usuario.token]);
  
  const enviarMensajeHandler = () => {
    console.log('aprete');
  };

  const cambiarEstadoModal = (parametros) => {
    setParametrosModal(parametros);
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
          <Paper style={{ height: '100%', padding: '10px' }} elevation={2}>
            <Typography variant="h4" align={'center'}>
              Dominios
            </Typography>

            <List>
              {dominiosEIntenciones?.map((dominio) => (
                <ListItem sx={{ justifyContent: 'center' }} key={dominio?.id}>
                  <Accordion
                    sx={{ minWidth: '300px', width: '100%' }}
                    elevation={2}
                  >
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
                          <ListItem key={intencion.id}>
                            <ListItemButton
                              onClick={() => setIntencionEdicion(intencion)}
                            >
                              <Typography>{intencion?.intencion}</Typography>
                            </ListItemButton>
                            <IconButton>
                              <RemoveIcon sx={{ color: 'red' }} />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              ))}
              <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  sx={{ backgroundColor: colors.blue[400] }}
                  onClick={() => cambiarEstadoModal({ tipo: 'nuevoDominio' })}
                >
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
          <Paper style={{ height: '100%', padding: '10px' }} elevation={2}>
            {intencionEdicion && (
              <List>
                <Typography variant="h5" align={'center'}>
                  {intencionEdicion.intencion}
                </Typography>
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
                          <ListItem key={regla.id}>
                            <ListItemButton
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              onClick={() =>
                                cambiarEstadoModal({
                                  propiedades: regla,
                                  tipo: 'regla',
                                })
                              }
                            >
                              <Typography>{regla.tipo}</Typography>
                            </ListItemButton>
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
                            onClick={() =>
                              cambiarEstadoModal({
                                tipo: 'nuevaRegla',
                                propiedades: reglasEsquema
                              })
                            }
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
                          <ListItem key={propiedad.llave}>
                            <ListItemButton
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              onClick={() =>
                                cambiarEstadoModal({
                                  propiedades: propiedad,
                                  tipo: 'propiedadUnica',
                                })
                              }
                            >
                              <Typography>{propiedad.llave}</Typography>
                            </ListItemButton>
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
                            onClick={() =>
                              cambiarEstadoModal({
                                tipo: 'nuevoParametroConfiguracion',
                              })
                            }
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
        {...parametrosModal}
      />
    </Paper>
  );
};

export default Intenciones;
