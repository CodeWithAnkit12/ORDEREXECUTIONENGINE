import { FastifyInstance } from 'fastify';
import { ordersRoute } from './api/orders.controller';
import orderWs from './ws/order.ws';

export default async function app(fastify: FastifyInstance) {

  fastify.get('/', async () => ({
    status: 'ok',
    service: 'order-execution-engine'
  }));

  fastify.register(ordersRoute);
  fastify.register(orderWs);
}
