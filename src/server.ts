import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import app from './app';

const server = Fastify({ logger: true });

server.register(websocket);
server.register(app);

server.listen({ port: 3000 }, err => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
