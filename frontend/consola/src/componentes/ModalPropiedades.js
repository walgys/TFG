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
  Autocomplete,
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

    setConfiguracionRegla({ ...configuracionRegla, [key]: value });
  };

  const obtenerArreglo = (key) => {

    if (reglaSeleccionada.id === 'MENU' || reglaSeleccionada.tipo === 'MENU')
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
                              <ListItemButton>
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
                                    <Autocomplete
                                      disablePortal
                                      id="intenciones-combo"
                                      options={intencionesEstado}
                                      getOptionLabel={option => option.label ? option.label : intencionesEstado.find(i=>i.value === option).label}
                                      isOptionEqualToValue={(option, value) => option.value === value}
                                      value={configuracionRegla[key][indice].idIntencion || null}
                                      onChange={(e,valor) =>
                                            onCambiarConfiguracion(
                                              key,
                                              configuracionRegla[key].map(
                                                (el, i) =>
                                                  i === indice
                                                    ? {
                                                        ...el,
                                                        idIntencion:
                                                          valor.value,
                                                      }
                                                    : el
                                              )
                                            )
                                          }
                                      sx={{ width: 300 }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="intencion"
                                          
                                        />
                                      )}
                                    />
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
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              label="Tópico del dominio"
            ></TextField>
          </FormControl>
        </div>
      );
      if (tipo === 'nuevaIntencion')
      return (
        <div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nueva Intencion
          </Typography>
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 230, margin: '8px 0px 8px 0px' }}
          >
            <TextField
              value={intencion.intencion}
              onChange={(e) => setIntencion({...intencion, intencion: e.target.value})}
              label="Nombre"
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

          {configuracionRegla &&
            Object.entries(configuracionRegla)
              .map(([key, value]) => obtenerControlFormulario(key, value))
              .sort((a, b) => a.orden - b.orden)
              .map((el) => el.valor)}
        </div>
      );

    if (tipo === 'modificarRegla') {  
      return (
        <div key="modificarRegla">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {reglaSeleccionada.tipo}
          </Typography>
          
          {configuracionRegla &&
            Object.entries(configuracionRegla)
              .map(([key, value]) => obtenerControlFormulario(key, value))
              .sort((a, b) => a.orden - b.orden)
              .map((el) => el.valor)}
        </div>
      );
    }
    if (tipo === 'eliminarDominio') {
      return (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {`¿Está seguro que desea eliminar el dominio ${propiedades.topico} ?`}
        </Typography>
      );
    }
      if (tipo === 'eliminarIntencion') {
        return (
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {`¿Está seguro que desea eliminar la intencion ${propiedades.intencion} ?`}
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
  const [dominio, setDominio] = useState('');
  const [intencionesEstado, setIintencionesEstado] = useState([]);
  const [intencion, setIntencion] = useState({intencion: '', reglas: [], topico: '', dominio: '', disparadores: [], puedeDispararOtraIntencion: false});

  const { estadoModal, cerrar, propiedades, tipo, aceptar, intenciones, regla } =
    props;
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

  useEffect(() => {
    if (intenciones) setIintencionesEstado(intenciones.map(intencion=>({label: intencion.intencion, value: intencion.id})));
  }, [intenciones]);

  useEffect(() => {
    if (regla && reglaSeleccionada.id === ''){
      setReglaSeleccionada(regla);
      setConfiguracionRegla({ ...regla.configuracion });
    }
  }, [regla])

  const aceptarModal = (tipo) => {

    //Creaciones

    if (tipo === 'nuevoDominio'){
      //reglas de validación de datos
      aceptar(dominio);
    }
    
    if (tipo === 'nuevaRegla'){
      //reglas de validación de datos
      aceptar({configuracion: {...configuracionRegla}, tipo: reglaSeleccionada.id});
    }

    if (tipo === 'nuevaIntencion'){
      //reglas de validación de datos
      aceptar({...intencion, dominio: propiedades.id, topico: propiedades.topico});
    }

    //Modificaciones
    
    if (tipo === 'modificarDominio'){
      //reglas de validación de datos
      aceptar(dominio);
    }

    if (tipo === 'modificarRegla'){
      //reglas de validación de datos
      aceptar({...reglaSeleccionada, configuracion: configuracionRegla});
    }

    if (tipo === 'modificarIntencion'){
      //reglas de validación de datos
      aceptar(intencion);
    }

    //Eliminaciones

    if (tipo === 'eliminarDominio' || tipo === 'eliminarIntencion' || tipo === 'eliminarRegla') aceptar(propiedades.id);

    cerrarModal();
  };

  const cerrarModal = () => {
    cerrar();
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
