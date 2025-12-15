import { FastifyPluginAsync } from 'fastify';
import { orderEvents } from '../utils/order-events';

const clients = new Map<string, Set<WebSocket>>();

const orderWs: FastifyPluginAsync = async (fastify) => {
  fastify.get('/ws/orders/:orderId', { websocket: true }, (conn, req) => {
    const { orderId } = req.params as any;

    if (!clients.has(orderId)) {
      clients.set(orderId, new Set());
    }

    clients.get(orderId)!.add(conn.socket);

    conn.socket.on('close', () => {
      clients.get(orderId)?.delete(conn.socket);
    });
  });
};

// 🔥 EVENT → WS BRIDGE
orderEvents.on('status', (orderId, payload) => {
  const sockets = clients.get(orderId);
  if (!sockets) return;

  for (const ws of sockets) {
    ws.send(JSON.stringify(payload));
  }
});

export default orderWs;
