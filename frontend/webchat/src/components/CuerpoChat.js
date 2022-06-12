import { List, Typography } from '@mui/material';
import './cuerpoChat.scss';
import MensajeEnviado from './MensajeEnviado';
import MensajeRecibido from './MensajeRecibido';

const CuerpoChat = () => {
  const negocio = 'Tiendy';
  const texto =
    'Hola, soy Tiendy.\nBienvenido a nuestra tienda, en que te puedo ayudar ?';
  const hora = '12:09 PM';
  const fechaSesion = '11/06/2022';
  return (
    <div className="cuerpo-chat">
      <Typography align="center" sx={{ fontSize: '10pt', color: 'dimgrey' }}>
        {fechaSesion}
      </Typography>
      <List>
        <MensajeEnviado texto={'Hola'} hora={'12:08PM'} estado={'recibido'} />
        <MensajeRecibido negocio={negocio} texto={texto} hora={hora} />
        <MensajeEnviado
          texto={'Quiero comprar un nuevo celular samsung para mi mama'}
          hora={'12:09 PM'}
          estado={'enviado'}
        />
        <MensajeRecibido negocio={negocio} texto={texto} hora={hora} ultimo />
      </List>
    </div>
  );
};

export default CuerpoChat;
