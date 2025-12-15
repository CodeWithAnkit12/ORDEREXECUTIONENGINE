import { Worker } from 'bullmq';
import { processOrder } from '../services/order.service';
import { orderEvents } from '../utils/order-events';

new Worker(
  'orders',
  async job => {
    try {
      await processOrder(job.data.orderId);
    } catch (err: any) {
      // 🔥 Emit failure event instead of calling WebSocket directly
      orderEvents.emit('status', job.data.orderId, {
        status: 'failed',
        error: err.message || 'Unknown error'
      });

      throw err; // important so BullMQ retries
    }
  },
  {
    concurrency: 10,
    connection: { host: '127.0.0.1', port: 6379 }
  }
);
