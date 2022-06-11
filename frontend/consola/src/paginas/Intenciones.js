import React, { useContext, useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppContext } from '../utilitarios/contextos';

const Intenciones = (props) => {
  const usuario = useSelector((state) => state.usuario);
  console.log(usuario);
  const context = useContext(AppContext);
  const { administradorConexion } = context;

  const enviarMensajeHandler = () => {
    console.log('aprete');
    administradorConexion.enviarMensaje({ id: '1234', texto: 'Hola mundo!' });
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
          <Paper style={{ height: '100%' }}>
            <Typography variant="h4">Dominios</Typography>
            <List>
              <ListItem>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>INICIO</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItemButton>
                        <Typography>SALUDO INICIAL</Typography>
                      </ListItemButton>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
              <ListItem>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>ECOMMERCE</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItemButton onClick={enviarMensajeHandler}>
                        <Typography>Pregunta ecommerce inicial</Typography>
                      </ListItemButton>
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
        ></div>
      </div>
    </Paper>
  );
};

export default Intenciones;
