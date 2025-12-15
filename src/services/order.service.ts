import { MockDexRouter } from '../mocks/mock-dex';
import { emitStatus } from '../ws/order.ws';
import { logger } from '../utils/logger';

const dex = new MockDexRouter();

export async function processOrder(orderId: string) {
  emitStatus(orderId, { status: 'pending' });

  emitStatus(orderId, { status: 'routing' });

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


  emitStatus(orderId, { status: 'building', dex: best.dex });

  emitStatus(orderId, { status: 'submitted' });

  const result = await dex.executeSwap(best.dex);

  emitStatus(orderId, {
    status: 'confirmed',
    txHash: result.txHash,
    price: result.executedPrice
  });
}
