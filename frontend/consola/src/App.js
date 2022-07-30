import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Ingreso from './paginas/Ingreso';
import Intenciones from './paginas/Intenciones';
import ProveedorAutenticacion from './servicios/ProveedorAutenticacion';
import './App.css';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Navegacion from './componentes/Navegacion';
import { Container } from '@mui/material';
import { AuthContext, AppContext } from './utilitarios/contextos';
import { useState } from 'react';
import { useContext } from 'react';
import AdministradorConexion from './servicios/administradorConexion';
import Configuracion from './paginas/Configuracion';
import Agentes from './paginas/Agentes';
import Chats from './paginas/Chats';
import Canales from './paginas/Canales';

function useAuth(AuthContext) {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }) {
  const { estado, setEstado, setCookie } = useContext(AppContext);
  let signin = (username, password, callback) => {
    return ProveedorAutenticacion.signin(username, password, (result) => {
      if (!result.error && result.validated === true) {
        setCookie('botaidToken', result.userCredential.user.accessToken);
        setCookie('emailUsuario', username);
        setEstado({
          ...estado,
          usuario: {
            ...estado.usuario,
            email: username,
            token: result.userCredential.user.accessToken,
          },
        });
      }
      callback(result);
    });
  };

  let signout = (callback) => {
    return ProveedorAutenticacion.signout(() => {
      callback();
    });
  };

  let value = { signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function RequireAuth({ children }) {
  let location = useLocation();
  let { cookies } = useContext(AppContext);
  let token = cookies.botaidToken;
  if (!token) {
    return <Navigate to="/Ingreso" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [estado, setEstado] = useState({
    usuario: {
      token: '',
      email: ''
    },
    claveIntenciones: 1,
  });
  const administradorConexion = AdministradorConexion.getInstancia(setEstado);
  const [cookies, setCookie, removeCookie] = useCookies([
    'botaidToken',
    'emailUsuario',
  ]);

  useEffect(() => {
    setEstado((prevState) => ({
      ...prevState,
      usuario: {
        ...prevState.usuario,
        email: cookies.emailUsuario,
        token: cookies.botaidToken,
      },
    }));
  }, [cookies]);

  return (
    <AppContext.Provider
      value={{
        administradorConexion,
        estado,
        token: estado.usuario.token,
        setCookie,
        cookies,
        setEstado
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Container>
            <Navegacion />
            <Routes>
              <Route path="/" element={<Navigate to="/intenciones" />} />
              <Route path="/ingreso" element={<Ingreso useAuth={useAuth} />} />
              <Route
                path="/intenciones"
                element={
                  <RequireAuth>
                    <Intenciones />
                  </RequireAuth>
                }
              />
               <Route path='/agentes' element={
                <RequireAuth>
                  <Agentes />
                </RequireAuth>
              } />
              <Route path='/configuracion' element={
                <RequireAuth>
                  <Configuracion />
                </RequireAuth>
              } />
               <Route path='/chats' element={
                <RequireAuth>
                  <Chats />
                </RequireAuth>
              } />
              <Route path='/canales' element={
                <RequireAuth>
                  <Canales />
                </RequireAuth>
              } />
            </Routes>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </AppContext.Provider>
  );
}

export default App;
