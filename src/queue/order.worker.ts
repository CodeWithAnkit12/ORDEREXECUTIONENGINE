import { Worker } from 'bullmq';
import { processOrder } from '../services/order.service';
import { emitStatus } from '../ws/order.ws';

new Worker(
  'orders',
  async job => {
    try {
      await processOrder(job.data.orderId);
    } catch (err: any) {
      emitStatus(job.data.orderId, {
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
