import { log } from 'node:console';
import { randomUUID } from 'node:crypto';
import net from 'node:net';
import { Writable } from 'node:stream';

const users = new Map();

const notifyListeners = (socketID, message) => {
  [...users.values()]
    .filter((user) => user.id !== socketID)
    .forEach((user) => user.write(message));
};

const streamBroadcaster = (socket) => {
  return Writable({
    write(chunk, enc, cb) {
      const data = JSON.stringify({
        id: socket.id.slice(0, 4),
        message: chunk.toString(),
      });
      notifyListeners(socket.id, data);
      cb();
    },
  });
};

const server = net.createServer((socket) => {
  socket.pipe(streamBroadcaster(socket));
});

server.on('connection', (socket) => {
  socket.id = randomUUID();
  console.log(`New connection ${socket.id}`);
  users.set(socket.id, socket);
  socket.write(JSON.stringify({ id: socket.id.slice(0, 4) }));

  socket.on('close', () => {
    log('Disconnected! ', socket.id);
    users.delete(socket.id);
  });
});

server.listen(8080, '0.0.0.0', () => {
  log('Server running on', server.address());
});
