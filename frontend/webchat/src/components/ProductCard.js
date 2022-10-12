import {
    ListItem,
    ListItemAvatar,
    Avatar,
    Typography,
    ListItemText,
    Card,
    CardContent,
    CardMedia,
    Button,
  } from '@mui/material';
  import './productCard.scss';
  import React from 'react';
  
  const ProductCard = (props) => {
    const { nombreAvatar, nombre, descripcion,
    precio,
    foto,
    opciones,
    administradorConexion, hora, ultimo = false } = props;

    const agregarProducto = ()=>{

    }
    const quitarProducto = ()=>{

    }

    return (
      <ListItem sx={{ alignItems: 'flex-start' }}>
        <ListItemAvatar sx={{ minWidth: '25px' }}>
          {ultimo && (
            <Avatar
              sx={{ width: '25px', height: '25px' }}
              alt="Remy Sharp"
              src="./__avatar_url.png"
            />
          )}
        </ListItemAvatar>
        <div style={{ display: 'flex' }}>
          <div className="arrow-left-recibido"></div>
          <div className="contenedor-mensaje-recibido">
            <div className='card-parent'>
                <img src={foto} className='fill'/>
              <Typography sx={{ position: 'absolute', top: '8.7rem', right: '0.3rem', maxWidth: '150px', wordWrap: 'break-word', textAlign: 'right'}}>{nombre}</Typography>
              <Typography sx={{position: 'absolute', bottom: '5rem', right: '0.3rem'}}>{`$${precio}`}</Typography>
                <div className='buttons'>
                    {opciones.agregar && (<Button variant='outlined' onClick={agregarProducto}>Agregar</Button>)}

                    {opciones.quitar && (<Button variant='outlined' onClick={quitarProducto}>Quitar</Button>)}
                    
                </div>
                
            </div>
            <ListItemText
              secondary={
                <Typography
                  align="right"
                  sx={{
                    color: 'black',
                    fontWeight: '800',
                    fontSize: '6pt',
                  }}
                >
                  {hora}
                </Typography>
              }
            />
          </div>
        </div>
      </ListItem>
    );
  };

  export default ProductCard;