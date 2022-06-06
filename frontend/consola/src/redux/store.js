import { configureStore } from '@reduxjs/toolkit';
import rebanadaUsuario from './reducers/rebanadaUsuario';

export const store = configureStore({
  reducer: {
    usuario: rebanadaUsuario,
  },
});
