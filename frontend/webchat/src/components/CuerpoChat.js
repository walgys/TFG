import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import './cuerpoChat.scss';

const CuerpoChat = () => {
  return (
    <div className="cuerpo-chat">
      <Typography align="center" sx={{ fontSize: '10pt', color: 'dimgrey' }}>
        11/06/2022
      </Typography>
      <List>
        <ListItem sx={{ alignItems: 'flex-start' }}>
          <ListItemAvatar sx={{ minWidth: '40px' }}>
            <Avatar
              sx={{ width: '30px', height: '30px' }}
              alt="Remy Sharp"
              src="./__avatar_url.png"
            />
          </ListItemAvatar>
          <div style={{ display: 'flex' }}>
            <div className="arrow-left"></div>
            <div className="contenedor-mensaje">
              <ListItemText
                sx={{
                  maxWidth: '180px',
                  wordWrap: 'break-word',
                }}
                primary={
                  <Typography
                    align="left"
                    sx={{ color: 'white', fontSize: '10pt' }}
                  >
                    Brunch this weekend? jlkdsajlkjdsadjaskljdksajldjal y algo
                    mas que eso
                  </Typography>
                }
                secondary={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'right',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      align="right"
                      sx={{
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '6pt',
                      }}
                    >
                      11:39 AM
                    </Typography>
                    <div style={{ minWidth: '15px', marginLeft: '5px' }}>
                      {' '}
                      <Typography
                        align="right"
                        sx={{
                          color: '#65fbf4',
                          fontWeight: '800',
                          fontSize: '8pt',
                        }}
                      >
                        ✓✓
                      </Typography>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </ListItem>
      </List>
    </div>
  );
};

export default CuerpoChat;
