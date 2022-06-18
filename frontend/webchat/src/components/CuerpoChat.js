import { List, Typography } from '@mui/material';
import moment from 'moment';
import './cuerpoChat.scss';
import MensajeEnviado from './MensajeEnviado';
import MensajeRecibido from './MensajeRecibido';

const CuerpoChat = (props) => {
  const { estado } = props;
  const { sesiones } = estado;
  const nombreAvatar = 'Tiendy';
  return (
    <div className="cuerpo-chat">
      {sesiones.map((sesion) => {
        const mensajesBot = sesion.mensajes.filter(
          (mensaje) => mensaje.origen === 'bot' || mensaje.origen === 'agente'
        );

        return (
          <div key={sesion.id}>
            <List
              className="lista-chat"
              sx={{
                position: 'relative',
                maxHeight: '500px',
                overflow: 'auto',
              }}
            >
              <Typography
                align="center"
                sx={{ fontSize: '10pt', color: 'dimgrey' }}
              >
                {moment(sesion.fecha).format('DD/MM/YYYY hh:mm:ss A')}
              </Typography>
              {sesion.mensajes.map((mensaje) => {
                if (mensaje.origen === 'bot' || mensaje.origen === 'agente') {
                  return (
                    <MensajeRecibido
                      key={mensaje.id}
                      negocio={nombreAvatar}
                      texto={mensaje.cuerpo?.texto}
                      hora={moment
                        .unix(mensaje.fecha._seconds)
                        .format('hh:mm A')}
                      ultimo={
                        mensajesBot[mensajesBot.length - 1].id === mensaje.id
                      }
                    />
                  );
                } else {
                  return (
                    <MensajeEnviado
                      key={mensaje.id}
                      texto={mensaje.cuerpo?.texto}
                      hora={moment
                        .unix(mensaje.fecha._seconds)
                        .format('hh:mm A')}
                      estado={mensaje.cuerpo?.estado}
                    />
                  );
                }
              })}
            </List>
          </div>
        );
      })}
    </div>
  );
};

export default CuerpoChat;
