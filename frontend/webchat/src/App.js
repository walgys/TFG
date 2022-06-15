import './App.css';
import EncabezadoChat from './components/EncabezadoChat';
import CuerpoChat from './components/CuerpoChat';
import PieChat from './components/PieChat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { CancelOutlined, Minimize } from '@mui/icons-material';
import { Fab, Grow, makeStyles } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';

function App(props) {
  const [estado, setEstado] = useState({ negocio: '', sesiones: [] });
  const [maximizado, setMaximizado] = useState(false);
  const { administradorConexion } = props;

  const minMax = () => {
    setMaximizado(!maximizado);
  };

  const obtenerConfigCallback = useCallback(()=>fetch('./config.json').then((res) => {
      return res.json();
    }).then(data => {
      setEstado({ ...estado, negocio: data.negocio });
    }),[estado.negocio]);

  useEffect(() => {
    obtenerConfigCallback();
    administradorConexion.configurar(setEstado);
    administradorConexion.buscarHistorialConversacion({
      idCliente: 'NQk1VIFVX7i0iKOfazow',
    });
  }, []);

  useEffect(() => {
    console.log(estado);
  }, [estado]);

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
