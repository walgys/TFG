import {useState} from 'react';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {Paper, Button, TextField} from '@mui/material'

const Ingreso = (props) => {
  const { useAuth, authContext } = props;
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth(authContext);

  let from = location.state?.from?.pathname || '/';
  
  const ingresar = () => {
    console.log('ingresar')
  
    auth.signin(usuario, contraseña, (result) => {
      if (!result.error && result.validated === true) {
        navigate(from, { replace: true });
      }
    });
  }

  return (
    <Paper>
      <div style={{display: 'flex', justifyContent: 'center', padding: '2rem'}}>
        <div style={{display: 'flex',height: '200px' , justifyContent: 'space-around', flexDirection: 'column', border: '1px solid black', borderRadius: '25px' , padding: '2rem'}} >
        <TextField
          id="outlined"
          label="usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />
         
         <TextField
          id="outlined"
          label="contraseña"
          value={contraseña}
          onChange={e => setContraseña(e.target.value)}
        />
        <Button variant='contained' onClick={ingresar}>Ingresar</Button> 
      </div>
      </div>
    </Paper>
  );
};

export default Ingreso;
