import { FastifyPluginAsync } from 'fastify';
import { v4 as uuid } from 'uuid';
import { orderQueue } from '../queue/order.queue';
import { orderRepository } from '../repositories/order.repository';

export const ordersRoute: FastifyPluginAsync = async (fastify) => {

  fastify.post('/api/orders/execute', async (req: any) => {
    const orderId = uuid();
    const { tokenIn, tokenOut, amount } = req.body;

    await orderRepository.create({
      id: orderId,
      tokenIn,
      tokenOut,
      amount,
      status: 'pending'
    });

    await orderQueue.add('execute', { orderId });

    return { orderId };
  });

  fastify.get('/api/orders', async (req: any) => {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    return orderRepository.findAll(limit, offset);
  });

  fastify.get('/api/orders/:id', async (req: any) => {
    const { id } = req.params;
    const order = await orderRepository.findById(id);

    if (!order) {
      return { error: 'Order not found' };
    }

    return order;
  });
};
