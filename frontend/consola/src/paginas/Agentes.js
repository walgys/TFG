import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
  colors
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../utilitarios/contextos';

const Agentes = () => {
  const { estado, administradorConexion } = useContext(AppContext);
  const { usuario, agentes } = estado;
  const { token } = usuario;
  const [roles, setRoles] = useState({'Administrador':[], 'Agente':[] })

  const obtenerAgentes = useCallback((token) => {
    administradorConexion.enviarMensaje({tipo: 'obtenerAgentes', mensaje: {
      token: token,
    }});
  });

  const agruparRoles = (agentes) => agentes.reduce((roles, item) => ({
    ...roles,
    [item.configuracion?.rol]: [...(roles[item.configuracion?.rol] || []), item]
  }), {});

  useEffect(() => {
    if (usuario.token !== '') {
      obtenerAgentes(usuario.token);
    }
  }, [usuario.token]);


  useEffect(() => {
    if(!!agentes) {
      setRoles({...roles, ...agruparRoles(agentes)});
    }
  }, [agentes])

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
              
                {roles && Object.entries(roles).map(([clave, agentes]) =>
                <ListItem key={clave} sx={{ justifyContent: 'center' }}>
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
                      { agentes && agentes.map(agente =>
                      <ListItem key={agente.id}>
                        <ListItemButton onClick={() => console.log('click')}>
                          <Typography>{`${agente.nombre} (${agente.alias})`}</Typography>
                        </ListItemButton>
                        <IconButton
                          onClick={() =>
                            console.log('click')
                          }
                        >
                          <RemoveIcon sx={{ color: 'red' }} />
                        </IconButton>
                      </ListItem>
                      
                      )}
                      <ListItem
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <IconButton
                        sx={{ backgroundColor: colors.blue[400] }}
                        onClick={() =>
                          console.log('click')
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
                )}
              
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
          <Paper
            style={{ height: '100%', padding: '10px' }}
            elevation={2}
          ></Paper>
        </div>
      </div>
    </Paper>
  );
};

export default Agentes;
