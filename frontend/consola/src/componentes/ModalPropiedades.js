import { Box, Modal, Typography } from '@mui/material';
import React from 'react';

const ModalPropiedades = (props) => {
  const { estadoModal, cerrar, propiedadModal } = props;
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
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {JSON.stringify(propiedadModal)}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalPropiedades;
