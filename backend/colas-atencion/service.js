const server = require('http').createServer();
const io = require('socket.io')(server, {
  path: '/',
});

io.on('connection', (client) => {
  console.log('someone connected');

  client.on('agregarMensaje', (data) => {
    console.log(`event: agregarMensaje, data: ${data}`);
    client.emit('recibirMensaje', 'Hello from http://localhost:5000');
  });

  client.on('heartbeat', () => {
    console.log('heartbeat');
    client.emit('heartbeat', '');
  });

  client.on('disconnect', () => {
    console.log('client disconnected');
  });
});

server.listen(4000);
console.log('started server on port 4000');
