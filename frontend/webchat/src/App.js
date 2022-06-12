import './App.css';
import EncabezadoChat from './components/EncabezadoChat';
import CuerpoChat from './components/CuerpoChat';
import PieChat from './components/PieChat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { CancelOutlined, Minimize } from '@mui/icons-material';
import { Fab, Grow, makeStyles } from '@mui/material';
import { useState } from 'react';

function App() {
  const [maximizado, setMaximizado] = useState(false);
  const minMax = () => {
    setMaximizado(!maximizado);
  };
  return (
    <div style={{ position: 'absolute', bottom: '0', right: '0' }}>
      <Grow
        in={maximizado}
        style={{ transformOrigin: 'bottom' }}
        {...(maximizado ? { timeout: 1500 } : { timeout: 1000 })}
      >
        <div className={maximizado ? 'webchat' : 'webchat minimizado'}>
          <EncabezadoChat />
          <CuerpoChat />
          <PieChat />
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
