import { FastifyInstance } from 'fastify';

const clients = new Map<string, WebSocket>();

export function emitStatus(orderId: string, data: any) {
  const ws = clients.get(orderId);
  if (ws) ws.send(JSON.stringify(data));
}

export default async function orderWs(fastify: FastifyInstance) {
  fastify.get('/ws/orders/:orderId', { websocket: true }, (conn, req) => {
    const { orderId } = req.params as any;
    clients.set(orderId, conn.socket);

    conn.socket.on('close', () => {
      clients.delete(orderId);
    });
  });
}
