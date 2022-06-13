import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
} from '@mui/material';
import './mensajeEnviado.scss';
import React from 'react';

const MensajeEnviado = (props) => {
  const { texto, hora, estado } = props;
  const colorEstado = {
    enviado: '#F2F2F7',
    recibido: '#65fbf4',
    error: 'red',
  };
  const iconoEstado = {
    enviado: '✓',
    recibido: '✓✓',
    error: '🗙',
  };
  return (
    <ListItem sx={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
      <div style={{ display: 'flex' }}>
        <div className="contenedor-mensaje-enviado">
          <ListItemText
            sx={{
              maxWidth: '180px',
              minWidth: '100px',
              wordWrap: 'break-word',
              margin: 0,
            }}
          >
            <div>
              <Typography align="left" sx={{ color: 'white', fontSize: '9pt' }}>
                {texto}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'end',
                }}
              >
                <Typography
                  align="right"
                  sx={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '6pt',
                  }}
                >
                  {hora}
                </Typography>
                <div style={{ minWidth: '15px', marginLeft: '5px' }}>
                  {' '}
                  <Typography
                    align="right"
                    sx={{
                      color: colorEstado[estado],
                      fontWeight: '800',
                      fontSize: '8pt',
                    }}
                  >
                    {iconoEstado[estado]}
                  </Typography>
                </div>
              </div>
            </div>
          </ListItemText>
        </div>
        <div className="arrow-right-enviado"></div>
      </div>
    </ListItem>
  );
};

export default MensajeEnviado;
