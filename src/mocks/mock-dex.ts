import { sleep } from '../utils/sleep';

export class MockDexRouter {
  async getRaydiumQuote() {
    await sleep(200);
    return { dex: 'raydium', price: 100 * (0.98 + Math.random() * 0.04) };
  }

  async getMeteoraQuote() {
    await sleep(200);
    return { dex: 'meteora', price: 100 * (0.97 + Math.random() * 0.05) };
  }

  async executeSwap(dex: string) {
  await sleep(2000 + Math.random() * 1000);

  // 20% failure simulation
  if (Math.random() < 0.2) {
    throw new Error(`DEX ${dex} execution failed`);
  }

  return {
    txHash: `0xMOCK_${Date.now()}`,
    executedPrice: 100
  };
}

}
