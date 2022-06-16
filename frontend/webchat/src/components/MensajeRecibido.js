import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
} from '@mui/material';
import './mensajeRecibido.scss';
import React from 'react';

const MensajeRecibido = (props) => {
  const { nombreAvatar, texto, hora, ultimo = false } = props;
  return (
    <ListItem sx={{ alignItems: 'flex-start' }}>
      <ListItemAvatar sx={{ minWidth: '25px' }}>
        {ultimo && (
          <Avatar
            sx={{ width: '25px', height: '25px' }}
            alt="Remy Sharp"
            src="./__avatar_url.png"
          />
        )}
      </ListItemAvatar>
      <div style={{ display: 'flex' }}>
        <div className="arrow-left-recibido"></div>
        <div className="contenedor-mensaje-recibido">
          <ListItemText
            sx={{
              maxWidth: '180px',
              wordWrap: 'break-word',
              margin: 0,
              minWidth: '100px',
            }}
            primary={
              <div style={{ maxWidth: '150px' }}>
                <Typography
                  align="left"
                  sx={{
                    color: 'black',
                    fontSize: '10pt',
                    fontWeight: '600',
                  }}
                >
                  {nombreAvatar}
                </Typography>
                <Typography
                  align="left"
                  sx={{
                    whiteSpace: 'pre-line',
                    color: 'black',
                    fontSize: '9pt',
                  }}
                >
                  {texto.replaceAll('\\n', '\n')}
                </Typography>
              </div>
            }
            secondary={
              <Typography
                align="right"
                sx={{
                  color: 'black',
                  fontWeight: '800',
                  fontSize: '6pt',
                }}
              >
                {hora}
              </Typography>
            }
          />
        </div>
      </div>
    </ListItem>
  );
};

export default MensajeRecibido;
