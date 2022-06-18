import './App.css';
import EncabezadoChat from './components/EncabezadoChat';
import CuerpoChat from './components/CuerpoChat';
import PieChat from './components/PieChat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { CancelOutlined, Minimize } from '@mui/icons-material';
import { Fab, Grow, makeStyles } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { v4 as uuid } from 'uuid';
import AdministradorConexion from './servicios/administradorConexion';

function App(props) {
  const [estado, setEstado] = useState({
    idNegocio: '',
    idCanal: '',
    sesiones: [],
    idCliente: '',
    token: '',
    forzarActualizarHistoral: false,
  });
  const [maximizado, setMaximizado] = useState(false);
  const administradorConexion = AdministradorConexion.getInstancia();
  const [cookies, setCookie, removeCookie] = useCookies(['botaidWebchatToken']);

  const minMax = () => {
    setMaximizado(!maximizado);
  };

  const obtenerConfigCallback = useCallback(() => {
    fetch('./config.json')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEstado((prevState) => ({
          ...prevState,
          idNegocio: data.idNegocio,
          idCanal: data.idCanal,
          actualizado: moment().unix(),
        }));
      });
  }, [estado.idNegocio]);

  useEffect(() => {
    if (
      (estado.idCliente != '' && estado.forzarActualizarHistoral)
    ) {
      administradorConexion.buscarHistorialConversacion({
        idSocket: estado.idSocket,
        id: uuid(),
        idCliente: estado.idCliente,
        token: estado.token,
      });
      setEstado((prevState) => ({
        ...prevState,
        forzarActualizarHistoral: false,
      }));
    }
  }, [estado.idCliente, estado.forzarActualizarHistoral]);

  useEffect(() => {
    if (cookies.botaidWebchatToken)
      setEstado((prevState) => ({
        ...prevState,
        token: cookies.botaidWebchatToken,
      }));
  }, [cookies.botaidWebchatToken]);

  useEffect(() => {
    obtenerConfigCallback();
    administradorConexion.configurar(setEstado, setCookie);
  }, []);

  useEffect(() => {
    console.log(estado);
  }, [estado]);

  useEffect(() => {
    if (estado.idCanal !== '' && estado.idNegocio !== '' && estado.idSocket)
      administradorConexion.obtenerCliente({
        idSocket: estado.idSocket,
        id: uuid(),
        idCanal: estado.idCanal,
        idNegocio: estado.idNegocio,
        token: estado.token,
      });
  }, [estado.idCanal, estado.idNegocio, estado.token]);

  const propiedadesCompartidas = { estado, setEstado, administradorConexion };

  return (
    <div style={{ position: 'absolute', bottom: '0', right: '0' }}>
      <Grow
        in={maximizado}
        style={{ transformOrigin: 'bottom' }}
        {...(maximizado ? { timeout: 1500 } : { timeout: 1000 })}
      >
        <div className={maximizado ? 'webchat' : 'webchat minimizado'}>
          <EncabezadoChat {...propiedadesCompartidas} />
          <CuerpoChat {...propiedadesCompartidas} />
          <PieChat {...propiedadesCompartidas} />
        </div>
      </Grow>
      <Fab
        sx={{
          position: 'absolute',
          bottom: maximizado ? 5 : 0,
          right: maximizado ? 5 : 0,
          marginRight: '25px',
          marginBottom: '15px',
        }}
        size={maximizado ? 'medium' : 'large'}
        color={maximizado ? 'error' : 'primary'}
        aria-label="add"
        onClick={minMax}
      >
        {maximizado ? <CancelOutlined /> : <ChatBubbleOutlineIcon />}
      </Fab>
    </div>
  );
}

export default App;
