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

const Intenciones = (props) => {
  const { estado, administradorConexion } = useContext(AppContext);
  const { usuario, dominiosEIntenciones } = estado;
  const [intencionEdicion, setIntencionEdicion] = useState();

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
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Typography variant="h4">Dominios</Typography>
              <Button variant="contained">+ Dominio</Button>
            </div>
            <List>
              {dominiosEIntenciones?.map((dominio) => (
                <ListItem key={dominio?.id}>
                  <Accordion sx={{ minWidth: '300px' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{dominio?.topico}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {dominio?.intenciones?.map((intencion) => (
                        <List key={intencion.id}>
                          <ListItemButton
                            onClick={() => setIntencionEdicion(intencion)}
                          >
                            <Typography>{intencion?.intencion}</Typography>
                          </ListItemButton>
                        </List>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              ))}
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
                <Typography align={'center'}>
                  {intencionEdicion.intencion}
                </Typography>
                <ListItem>
                  <Accordion sx={{ minWidth: '300px' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Disparadores</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {intencionEdicion?.disparadores?.map((disparador) => (
                        <List key={disparador}>
                          <ListItem
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
                        </List>
                      ))}
                      <ListItem
                        sx={{ displat: 'flex', justifyContent: 'center' }}
                      >
                        <IconButton sx={{ backgroundColor: colors.blue[400] }}>
                          <AddIcon
                            sx={{
                              color: colors.common.white,
                            }}
                          />
                        </IconButton>
                      </ListItem>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              </List>
            )}
          </Paper>
        </div>
      </div>
    </Paper>
  );
};

export default Intenciones;
