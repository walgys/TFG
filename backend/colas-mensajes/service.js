const server = require('http').createServer();
const { Cola } = require('./cola');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
  path: '/',
});
const cola = new Cola();

io.on('connection', (client) => {
  console.log('someone connected');

  client.on('agregarMensaje', (mensaje) => {
    console.log(`event: agregarMensaje, data: ${mensaje}`);
    cola.ponerEnCola(JSON.parse(mensaje));
    client.emit('respuestaAgregarMensaje', mensaje);
  });

  client.on('obtenerMensajes', (datos) => {
    const objetoDatos = JSON.parse(datos);
    const mensajes = cola.sacarDeCola(objetoDatos.cantidad);
    client.emit(
      'respuestaObtenerMensajes',
      JSON.stringify({
        idCallback: objetoDatos.idCallback,
        mensajes: mensajes,
      })
    );
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
