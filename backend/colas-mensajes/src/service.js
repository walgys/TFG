const server = require('http').createServer();
const { Cola } = require('./cola');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
  path: '/',
});
const colas = [];

io.on('connection', (client) => {
  console.log('someone connected');

  client.on('agregarMensaje', (datos) => {
    const { topico, mensaje } = JSON.parse(datos);
    const colaEncontrada = colas.find((cola) => cola.topico === topico);
    let cola;
    if (!colaEncontrada) {
      cola = new Cola(topico);
    } else {
      cola = colaEncontrada.cola;
    }

    cola.ponerEnCola(mensaje);
    colas.push({ topico: topico, cola: cola });
    client.emit('respuestaAgregarMensaje', mensaje);
  });

  client.on('obtenerMensajes', (datos) => {
    const objetoDatos = JSON.parse(datos);
    const { topico } = objetoDatos;

    let mensajes = [];
    if (colas.length > 0) {
      const colaEncontrada = colas.find((cola) => cola?.topico === topico);

      if (colaEncontrada) {
        const { cola } = colaEncontrada;
        mensajes = cola.sacarDeCola(objetoDatos.cantidad);
      }
    }

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
