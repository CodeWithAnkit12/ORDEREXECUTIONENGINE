import { MockDexRouter } from '../mocks/mock-dex';
import { orderEvents } from '../utils/order-events';
import { logger } from '../utils/logger';

const dex = new MockDexRouter();

export async function processOrder(orderId: string) {
  orderEvents.emit('status', orderId, { status: 'pending' });

  orderEvents.emit('status', orderId, { status: 'routing' });

  const raydium = await dex.getRaydiumQuote();
  const meteora = await dex.getMeteoraQuote();

  logger.info('DEX quotes received', {
    orderId,
    raydium,
    meteora
  });

  const best = raydium.price > meteora.price ? raydium : meteora;

  logger.info('Routing decision', {
    orderId,
    chosenDex: best.dex,
    price: best.price
  });

  orderEvents.emit('status', orderId, {
    status: 'building',
    dex: best.dex
  });

  orderEvents.emit('status', orderId, { status: 'submitted' });

  const result = await dex.executeSwap(best.dex);

  orderEvents.emit('status', orderId, {
    status: 'confirmed',
    txHash: result.txHash,
    price: result.executedPrice
  });
}
