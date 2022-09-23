import { Button, Card, CardActions, CardContent, Paper, Typography } from '@mui/material';
import React from 'react';

const canales = [
  {nombre: 'messenger', conectado: false, descripcion: 'Facebook Messenger', logo: ''},
  {nombre: 'instagram', conectado: false, descripcion: 'Instagram', logo: ''},
  {nombre: 'telegram', conectado: false, descripcion: 'Telegram', logo: ''}
]

const Canales = () => {
  return (
    <Paper>
      <div style={{ display: 'flex', minHeight: '90vh' }}>
         <div
        style={{
          display: 'flex',
          width: '100%',
          padding: '30px 30px 30px 30px',
          justifyContent: 'space-around',
        }}
      >
        {canales.map((canal) => (
          <Card
            elevation={2}
            key={canal.nombre}
            sx={{
              minWidth: 275,
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent>
              <Typography
                align="center"
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {canal.descripcion}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button color='primary' variant='outlined' disabled={canal.conectado} size="small">
                Conectar
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      </div>
     
    </Paper>
  );
};

export default Canales;
