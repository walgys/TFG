import { List, Typography } from '@mui/material';
import moment from 'moment';
import { createRef, useEffect, useRef } from 'react';
import './cuerpoChat.scss';
import MensajeEnviado from './MensajeEnviado';
import MensajeRecibido from './MensajeRecibido';
import Menu from './Menu';
import ProductCard from './ProductCard';

const CuerpoChat = (props) => {
  const { estado, setEstado, administradorConexion } = props;
  const { sesiones } = estado;
  const nombreAvatar = 'Tiendy';
  const refItem = createRef();

  useEffect(() => {
    refItem.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [sesiones]);

  return (
    <div className="cuerpo-chat">
      {sesiones.map((sesion, indiceSesion) => {
        const ultimaSesion =
          indiceSesion === sesiones.length - 1 ? true : false;
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
              {sesion.mensajes.map((mensaje, indice) => {
                if (mensaje.origen === 'bot' || mensaje.origen === 'agente') {
                  if (mensaje.cuerpo?.tipo === 'MENU') {
                    return (
                      <Menu
                        key={mensaje.id}
                        nombreAvatar={nombreAvatar}
                        titulo={mensaje.cuerpo?.titulo}
                        encabezado={mensaje.cuerpo?.encabezado}
                        opciones={mensaje.cuerpo?.opciones}
                        estado={estado}
                        setEstado={setEstado}
                        administradorConexion={administradorConexion}
                        hora={moment
                          .unix(mensaje.fecha._seconds)
                          .format('hh:mm A')}
                        ultimo={
                          mensajesBot[mensajesBot.length - 1].id === mensaje.id
                        }
                      />
                    );
                  } else if (mensaje.cuerpo?.tipo === 'CARD') {
                    return mensaje.cuerpo.cards.map((card, index) => <ProductCard
                    key={mensaje.id+index}
                    nombreAvatar={nombreAvatar}
                    nombre={card.nombre}
                    descripcion={card.descripcion}
                    precio={card.precio}
                    foto={card.foto}
                    opciones={card.opciones}
                    administradorConexion={administradorConexion}
                    hora={moment
                      .unix(mensaje.fecha._seconds)
                      .format('hh:mm A')}
                    ultimo={
                      mensajesBot[mensajesBot.length - 1].id === mensaje.id
                    }
                    />);
                  } else {
                    return (
                      <MensajeRecibido
                        key={mensaje.id}
                        nombreAvatar={nombreAvatar}
                        texto={mensaje.cuerpo?.texto}
                        hora={moment
                          .unix(mensaje.fecha._seconds)
                          .format('hh:mm A')}
                        ultimo={
                          mensajesBot[mensajesBot.length - 1].id === mensaje.id
                        }
                      />
                    );
                  }
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
              <div ref={refItem}></div>
            </List>
          </div>
        );
      })}
    </div>
  );
};

export default CuerpoChat;
