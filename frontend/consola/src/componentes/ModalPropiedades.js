import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  colors,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import './modalPropiedades.scss';

const ModalPropiedades = (props) => {
  const onSeleccionarRegla = (id) => {
    const regla = propiedades.find((regla) => regla.id === id);
    setReglaSeleccionada(regla);
    setConfiguracionRegla({ ...regla.configuracion });
  };

  const onCambiarConfiguracion = (key, value) => {
    console.log('key', key);
    console.log('value', value);
    setConfiguracionRegla({ ...configuracionRegla, [key]: value });
  };

  const obtenerArreglo = (key) => {
    if (reglaSeleccionada.id === 'MENU')
      return {
        orden: 9,
        valor: (
          <>
            <Accordion
              key={key}
              sx={{ minWidth: '300px', width: '100%' }}
              elevation={2}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{key}</Typography>
               
              </AccordionSummary>
              <AccordionDetails>
                <List key={`list-${key}`}>
                  {configuracionRegla[key].map((opcion, indice) => (
                    <div
                      key={`list-${key}-${indice}`}
                      style={{ display: 'flex' }}
                    >
                      <Accordion
                        key={`acordion-${indice}`}
                        sx={{
                          minWidth: '300px',
                          width: '100%',
                          margin: '5px 0px 5px 0px',
                        }}
                        elevation={2}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{`botón ${indice + 1}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List key={`list-${indice}`}>
                            <ListItem key={`${indice}-accion`}>
                              <ListItemButton onClick={() => console.log}>
                                <FormControl
                                  fullWidth
                                  key={key}
                                  sx={{
                                    m: 1,
                                    minWidth: 230,
                                    margin: '8px 0px 8px 0px',
                                  }}
                                >
                                  <InputLabel id="select-accion-label">
                                    acción
                                  </InputLabel>
                                  <Select
                                    labelId="select-accion-label"
                                    id="select-accion"
                                    value={opcion.accion}
                                    label="select-accion-label"
                                    onChange={(e) =>
                                      onCambiarConfiguracion(
                                        key,
                                        configuracionRegla[key].map((el, i) =>
                                          i === indice
                                            ? {
                                                ...el,
                                                accion: e.target.value,
                                              }
                                            : el
                                        )
                                      )
                                    }
                                  >
                                    <MenuItem value={'IR_INTENCION'}>
                                      IR_INTENCION
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </ListItemButton>
                            </ListItem>

                            {opcion.accion === 'IR_INTENCION' && (
                              <div key="seleccionIdIntencion">
                                <ListItem key={`${indice}-idIntencion`}>
                                  <FormControl
                                    fullWidth
                                    sx={{
                                      m: 1,
                                      minWidth: 230,
                                      margin: '8px 16px 8px 16px',
                                    }}
                                  >
                                    <TextField
                                      value={
                                        configuracionRegla[key][indice]
                                          .idIntencion ?? ''
                                      }
                                      onChange={(e) =>
                                        onCambiarConfiguracion(
                                          key,
                                          configuracionRegla[key].map((el, i) =>
                                            i === indice
                                              ? {
                                                  ...el,
                                                  idIntencion: e.target.value,
                                                }
                                              : el
                                          )
                                        )
                                      }
                                      label="id intención"
                                    ></TextField>
                                  </FormControl>
                                </ListItem>
                                <ListItem key={`${indice}-texto`}>
                                  <FormControl
                                    fullWidth
                                    sx={{
                                      m: 1,
                                      minWidth: 230,
                                      margin: '8px 16px 8px 16px',
                                    }}
                                  >
                                    <TextField
                                      value={
                                        configuracionRegla[key][indice].texto ??
                                        ''
                                      }
                                      onChange={(e) =>
                                        onCambiarConfiguracion(
                                          key,
                                          configuracionRegla[key].map((el, i) =>
                                            i === indice
                                              ? {
                                                  ...el,
                                                  texto: e.target.value,
                                                }
                                              : el
                                          )
                                        )
                                      }
                                      label="texto"
                                    ></TextField>
                                  </FormControl>
                                </ListItem>
                              </div>
                            )}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                      <IconButton
                        onClick={() =>
                          onCambiarConfiguracion(
                            key,
                            configuracionRegla[key].filter(
                              (o, i) => i !== indice
                            )
                          )
                        }
                      >
                        <RemoveIcon sx={{ color: 'red' }} />
                      </IconButton>
                    </div>
                  ))}
                  {configuracionRegla[key].length < 5 && (
                    <ListItem
                      key="botonAgregar"
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <IconButton
                        sx={{ backgroundColor: colors.blue[400] }}
                        onClick={() =>
                          onCambiarConfiguracion(key, [
                            ...configuracionRegla[key],
                            { accion: '' },
                          ])
                        }
                      >
                        <AddIcon
                          sx={{
                            color: colors.common.white,
                          }}
                        />
                      </IconButton>
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </>
        ),
      };
  };

  const obtenerControlFormulario = (key, value) => {
    if (typeof value === 'string')
      return {
        orden: 1,
        valor: (
          <FormControl
            fullWidth
            key={key}
            sx={{ m: 1, minWidth: 230, margin: '8px 0px 8px 0px' }}
          >
            <TextField
              value={configuracionRegla[key]}
              onChange={(e) => onCambiarConfiguracion(key, e.target.value)}
              label={key}
            >
              {configuracionRegla[key]}
            </TextField>
          </FormControl>
        ),
      };
    if (key === 'necesitaRespuesta')
      return {
        orden: 8,
        valor: (
          <FormControl
            fullWidth
            key={key}
            sx={{ m: 1, minWidth: 230, margin: '8px 0px 8px 0px' }}
          >
            <InputLabel id="select-necesitaRespuesta-label">
              Necesita respuesta
            </InputLabel>
            <Select
              labelId="select-necesitaRespuesta-label"
              id="select-necesitaRespuesta"
              value={configuracionRegla[key]}
              label="Necesita respuesta"
              onChange={(e) => onCambiarConfiguracion(key, e.target.value)}
            >
              <MenuItem value={true}>SI</MenuItem>
              <MenuItem value={false}>NO</MenuItem>
            </Select>
          </FormControl>
        ),
      };
    if (Array.isArray(value)) return obtenerArreglo(key);
  };

  const construirFormulario = ({ propiedades, tipo }) => {
    if (tipo === 'nuevoDominio')
      return (
        <div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nuevo Dominio
          </Typography>
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 230, margin: '8px 0px 8px 0px' }}
          >
            <TextField
              value={nuevoDominio}
              onChange={(e) => setNuevoDominio(e.target.value)}
              label="Tópico del dominio"
            ></TextField>
          </FormControl>
        </div>
      );
    if (tipo === 'nuevaRegla')
      return (
        <div key="nuevaRegla">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nueva Regla
          </Typography>
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 230, margin: '8px 0px 8px 0px' }}
          >
            <InputLabel id="reglas-select-label">Esquema de Regla</InputLabel>
            <Select
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
            Object.entries(reglaSeleccionada.configuracion)
              .map(([key, value]) => obtenerControlFormulario(key, value))
              .sort((a, b) => a.orden - b.orden)
              .map((el) => el.valor)}
        </div>
      );

    if (tipo === 'regla') {
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {JSON.stringify(propiedades)}
        </Typography>
      );
    } 
    if (tipo === 'eliminarDominio') {
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {`¿Está seguro que desea eliminar el dominio ${propiedades.topico} ?`}
        </Typography>
      );
    } 
    else {
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Sin datos
        </Typography>
      );
    }
  };

  const [reglaSeleccionada, setReglaSeleccionada] = useState({ id: '' });
  const [configuracionRegla, setConfiguracionRegla] = useState({});
  const [nuevoDominio, setNuevoDominio] = useState('');
  useEffect(() => {
    console.log(configuracionRegla);
  }, [configuracionRegla]);

  const { estadoModal, cerrar, propiedades, tipo, aceptar } = props;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '500px',
    minWidth: '400px',
    maxHeight: '90vh',
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const restablecerModal = () => {
    setReglaSeleccionada({ id: '' });
    setConfiguracionRegla({});
    setNuevoDominio('');
  };

  const aceptarModal = (tipo) => {
    if (tipo === 'nuevoDominio') aceptar(nuevoDominio);
    if (tipo === 'eliminarDominio') aceptar(propiedades.id)
    cerrarModal();
  };

  const cerrarModal = () => {
    cerrar();
    restablecerModal();
  };

  return (
    <Modal
      open={estadoModal}
      onClose={cerrarModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div key="cuerpoModal" className="cuerpo-modal">
          {construirFormulario({ ...props })}
        </div>
        <div
          key="pieModal"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Button
            sx={{ margin: '8px 0px 8px 0px', minWidth: 230 }}
            variant="contained"
            color="error"
            onClick={cerrarModal}
          >
            Cancelar
          </Button>
          <Button
            sx={{ margin: '8px 0px 8px 0px', minWidth: 230 }}
            variant="contained"
            onClick={() => aceptarModal(tipo)}
          >
            Aceptar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalPropiedades;
