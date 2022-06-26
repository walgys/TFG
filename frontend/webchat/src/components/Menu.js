import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import './menu.scss';

const StyledButton = styled(Button)`
  border-bottom: 1px solid #005bae;
  margin: 0;
  padding: 0;
  border-radius: 0;
  width: 100%;
  color: black;
  font-size: 9pt;
  text-transform: none;
  background-color: #e7e7e7;
  &:hover {
    background-color: #bfbfbf;
  }
`;

const Menu = (props) => {
  const { estado, setEstado, administradorConexion } = props;
  const { sesiones, token, idCliente, idSocket, idNegocio } = estado;
  const enviarOpcion = (opcion) => {
    const mensaje = {
      idSocket: idSocket,
      idSesion: sesiones[sesiones.length - 1].id,
      idCliente: idCliente,
      idNegocio: idNegocio,
      cuerpo: { texto: opcion.texto, opcion: opcion },
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
            cuerpo: { ...mensaje.cuerpo, estado: 'esperando' },
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
  };

  const {
    nombreAvatar,
    encabezado,
    titulo,
    opciones,
    hora,
    ultimo = false,
  } = props;
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
        <div className="contenedor-menu">
          <div className="contenedor-mensaje-menu-recibido">
            <ListItemText
              sx={{
                maxWidth: '180px',
                wordWrap: 'break-word',
                margin: 0,
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
                    {encabezado?.replaceAll('\\n', '\n')}
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="menu">
            <Typography
              align="center"
              sx={{
                borderBottom: '1px solid #005bae',
                margin: 0,
                padding: 0,
                borderRadius: 0,
                width: '100%',
                fontSize: '10pt',
              }}
            >
              {titulo}
            </Typography>
            {opciones?.map((opcion, indice) => (
              <StyledButton
                key={`${opcion.texto}-${opcion.idIntencion}-${indice}`}
                variant="text"
                onClick={() => enviarOpcion(opcion)}
              >
                {opcion.texto}
              </StyledButton>
            ))}
          </div>
          <ListItemText
            sx={{
              maxWidth: '180px',
              wordWrap: 'break-word',
              margin: 0,
            }}
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

export default Menu;
