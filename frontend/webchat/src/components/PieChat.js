import { IconButton, InputBase } from '@mui/material';
import { flexbox } from '@mui/system';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';
import React, { useContext, useState } from 'react';
import './pieChat.scss';

const PieChat = (props) => {
  const [textoEnviar, setTextoEnviar] = useState('');
  const { estado, setEstado, administradorConexion } = props
  const { sesiones } = estado;

  const enviarMensaje = () => {
    administradorConexion.enviarMensaje({ id: 1, texto: textoEnviar });
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
