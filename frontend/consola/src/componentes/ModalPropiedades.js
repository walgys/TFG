import { Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';



const ModalPropiedades = (props) => {

  const onSeleccionarRegla = (id) => {
    const regla = propiedades.find(regla => regla.id === id)
    setReglaSeleccionada(regla);
    setConfiguracionRegla({ ...regla.configuracion});
  }

  const onCambiarConfiguracion = (key, value) => {
    setConfiguracionRegla({ ...configuracionRegla, [key]: value });
  }
  
  const construirFormulario = ({ propiedades, tipo }) => {
    if (tipo === 'nuevoDominio')
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          NuevoDominio
        </Typography>
      );
    if (tipo === 'nuevaRegla')
      return (
        <div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            nuevaRegla
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 230, width: '100%' }}>
            <InputLabel id="reglas-select-label">Esquema de Regla</InputLabel>
            <Select
              fullWidth
              labelId="reglas-select-label"
              id="demo-simple-select-helper"
              value={reglaSeleccionada.id}
              label="Esquema de Regla"
              onChange={(e) => onSeleccionarRegla(e.target.value)}
            >
              {propiedades.map((regla) => (
                <MenuItem key={regla.id} value={regla.id}>
                  {regla.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
            {reglaSeleccionada.configuracion &&
              Object.entries(reglaSeleccionada.configuracion).map(
                ([key, value]) => {
                  if (key === 'texto')
                    return (<FormControl key={key} sx={{ m: 1, minWidth: 230, width: '100%' }}>
                      <TextField value={configuracionRegla[key]} onChange={(e) => onCambiarConfiguracion(key,e.target.value)} label={key}>
                        {configuracionRegla[key]}
                      </TextField></FormControl>
                    );
                  if (key === 'necesitaRespuesta')
                    return (
                      <FormControl key={key} sx={{ m: 1, minWidth: 230, width: '100%' }}>
                        <InputLabel id="select-necesitaRespuesta-label">Necesita respuesta</InputLabel>
                      <Select
                          fullWidth
                          labelId='select-necesitaRespuesta-label'
                        id="select-necesitaRespuesta"
                        value={configuracionRegla[key]}
                        label="Necesita respuesta"
                        onChange={(e) => onCambiarConfiguracion(key,e.target.value)}
                      >
                        <MenuItem value={true}>SI</MenuItem>
                        <MenuItem value={false}>NO</MenuItem>
                      </Select></FormControl>
                    );
                }
              )}
          
        </div>
      );
  
    if (tipo === 'regla') {
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {JSON.stringify(propiedades)}
        </Typography>
      );
    } else {
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Sin datos
        </Typography>
      );
    }
  };

  const [reglaSeleccionada, setReglaSeleccionada] = useState({ id: '' });
  const [configuracionRegla, setConfiguracionRegla] = useState({});
  useEffect(() => {
    console.log(configuracionRegla)
  }, [configuracionRegla])
  
  
  const { estadoModal, cerrar, propiedades, tipo } = props;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    minWidth: '400px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={estadoModal}
      onClose={cerrar}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{construirFormulario({ ...props})}</Box>
    </Modal>
  );
};

export default ModalPropiedades;
