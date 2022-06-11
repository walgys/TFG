import { IconButton, InputBase } from '@mui/material';
import { flexbox } from '@mui/system';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';
import './pieChat.scss';

const PieChat = () => {
  return (
    <div className="piechat-contenedor">
      <IconButton aria-label="smileys">
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Escriba aqui..."
        inputProps={{ 'aria-label': 'escriba aqui' }}
      />
      <IconButton>
        <AlternateEmailIcon />
      </IconButton>
      <IconButton>
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default PieChat;
