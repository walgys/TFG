import { IconButton, InputBase } from '@mui/material';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';
import React, { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import './pieChat.scss';
import moment from 'moment';

const PieChat = (props) => {
  const [textoEnviar, setTextoEnviar] = useState('');
  const { estado, setEstado, administradorConexion } = props;
  const { sesiones, token, idCliente, idSocket } = estado;

  const enviarMensaje = () => {
    const mensaje = {
      idSocket: idSocket,
      idSesion: sesiones[sesiones.length - 1].id,
      idCliente: idCliente,
      texto: textoEnviar,
      fecha: { _seconds: moment().unix() },
      origen: 'cliente',
      token: token,
      id: uuid(),
    };

    const sesionesNuevo = estado.sesiones.map((sesion, indice) => {
      if (indice === estado.sesiones.length - 1) {
        const mensajes = [
          ...sesion.mensajes,
          {
            id: mensaje.id,
            fecha: mensaje.fecha,
            origen: mensaje.origen,
            cuerpo: { texto: mensaje.texto, estado: 'esperando' },
          },
        ];
        return { ...sesion, mensajes: mensajes };
      } else {
        return sesion;
      }
    });
    const nuevoEstado = { ...estado, sesiones: sesionesNuevo };
    console.log(nuevoEstado);
    setEstado(nuevoEstado);
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
