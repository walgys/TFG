import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Ingreso from './paginas/Ingreso';
import Intenciones from './paginas/Intenciones';
import ProveedorAutenticacion from './componentes/ProveedorAutenticacion';
import './App.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asignarUsuario } from './redux/reducers/rebanadaUsuario';
import { useCookies } from 'react-cookie';
import Navegacion from './componentes/Navegacion';
import {Container} from '@mui/material';

let AuthContext = React.createContext();

function useAuth(AuthContext) {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies([
    'botaidToken',
    'emailUsuario',
  ]);
  let signin = (username, password, callback) => {
    return ProveedorAutenticacion.signin(username, password, (result) => {
      if (!result.error && result.validated === true) {
        setCookie('botaidToken', result.userCredential.user.accessToken);
        setCookie('emailUsuario', username);
        dispatch(
          asignarUsuario({
            email: username,
            token: result.userCredential.user.accessToken,
          })
        );
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
  const token = useSelector((state) => state.usuario.credencialUsuario.token);
  if (!token) {
    return <Navigate to="/Ingreso" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
    'botaidToken',
    'emailUsuario',
  ]);
  const dispatch = useDispatch();
  if (cookies.botaidToken && cookies.emailUsuario)
    dispatch(
      asignarUsuario({
        email: cookies.emailUsuario,
        token: cookies.botaidToken,
      })
    );

  return (
    <AuthProvider>
      <BrowserRouter>
      <Container>
      <Navegacion />
        <Routes>
          <Route path="/" element={<Navigate to="/Intenciones" />} />
          <Route
            path="/Ingreso"
            element={<Ingreso useAuth={useAuth} authContext={AuthContext} />}
          />
          <Route
            path="/Intenciones"
            element={
              <RequireAuth>
                <Intenciones authContext={AuthContext} />
              </RequireAuth>
            }
          />
        </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
