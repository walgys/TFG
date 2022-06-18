import { IconButton, InputBase } from '@mui/material';
import { flexbox } from '@mui/system';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';
import React, { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import './pieChat.scss';

const PieChat = (props) => {
  const [textoEnviar, setTextoEnviar] = useState('');
  const { estado, setEstado, administradorConexion } = props;
  const { sesiones, token, idCliente } = estado;

  const enviarMensaje = () => {
    const mensaje = {
      idSesion: sesiones[sesiones.length - 1].id,
      idCliente: idCliente,
      texto: textoEnviar,
      origen: 'cliente',
      token: token,
      id: uuid(),
    };

    administradorConexion.enviarMensaje(mensaje);
    setTextoEnviar('');
  };
  return (
    <div className="piechat-contenedor">
      <IconButton aria-label="smileys">
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Escriba aqui..."
        inputProps={{ 'aria-label': 'escriba aqui' }}
        onChange={(e) => setTextoEnviar(e.target.value)}
        value={textoEnviar}
      />
      <IconButton>
        <AlternateEmailIcon />
      </IconButton>
      <IconButton onClick={enviarMensaje}>
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default PieChat;
