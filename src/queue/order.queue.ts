import { Queue } from 'bullmq';

export const orderQueue = new Queue('orders', {
  connection: { host: '127.0.0.1', port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});
