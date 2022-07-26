import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const configuracion = () => {
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
                      <ListItem>
                        <ListItemButton onClick={() => console.log('click')}>
                          <Typography>Datos Externos</Typography>
                        </ListItemButton>
                      </ListItem>
                      <ListItem>
                        <ListItemButton onClick={() => console.log('click')}>
                          <Typography>Variables</Typography>
                        </ListItemButton>
                      </ListItem>
                      <ListItem>
                        <ListItemButton onClick={() => console.log('click')}>
                          <Typography>Constantes</Typography>
                        </ListItemButton>
                      </ListItem>
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
          <Paper
            style={{ height: '100%', padding: '10px' }}
            elevation={2}
          ></Paper>
        </div>
      </div>
    </Paper>
  );
};

export default configuracion;
