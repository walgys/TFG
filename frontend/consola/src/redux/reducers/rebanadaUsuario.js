import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  credencialUsuario: {},
};

export const rebanadaUsuario = createSlice({
  name: 'user',
  initialState,
  reducers: {
    asignarUsuario: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.credencialUsuario = { ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { asignarUsuario } = rebanadaUsuario.actions;

export default rebanadaUsuario.reducer;
