import { List, ListItem, ListItemButton, Paper } from "@mui/material";

const Chats = () => {
  return <Paper>
  <div style={{ 
    display: 'flex',
    minHeight: '90vh',
    }}>
    <div
    style={{
      display: 'flex',
      width: '100%',
      margin: '30px 30px 30px 30px',
      border: '1px solid gainsboro',
      borderBottomRightRadius: '15px',
      borderTopRightRadius: '15px',
      boxShadow: '2px 3px 3px -2px rgba(0,0,0,0.2)',
    }}
    >
<div
      style={{
        display: 'flex',
        flex: 0.5,
        flexDirection: 'column',
        borderRight: '1px solid gainsboro',
      }}
    >      
      <List >
          <ListItemButton sx={{ justifyContent: 'center', borderBottom: '1px solid gainsboro', borderTop: '1px solid gainsboro',  height: '80px'}}>
            
          </ListItemButton>
          <ListItemButton sx={{ justifyContent: 'center', borderBottom: '1px solid gainsboro', height: '80px'}}>
            
          </ListItemButton>
        </List>
      
    </div>
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      }}
    >
      
    </div>
    <div
      style={{
        display: 'flex',
        borderTop: '1px solid gainsboro',
        flex: 0.2,
      }}
    >
      
    </div>
    </div>
    <div
      style={{
        display: 'flex',
        flex: 0.5,
        flexDirection: 'column',
        borderLeft: '1px solid gainsboro'
      }}
    >
      
    </div>
    </div>
  </div>
</Paper>;
};

export default Chats;
