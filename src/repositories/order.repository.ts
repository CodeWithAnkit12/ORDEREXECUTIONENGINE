import { pgPool } from '../config/postgres';

export interface OrderRepository {
  create(order: {
    id: string;
    tokenIn: string;
    tokenOut: string;
    amount: number;
    status: string;
  }): Promise<void>;

  updateStatus(
    id: string,
    status: string,
    data: Partial<{
      dex: string;
      executed_price: number;
      tx_hash: string;
      error: string;
    }>
  ): Promise<void>;

  findById(id: string): Promise<any>;

  findAll(limit?: number, offset?: number): Promise<any[]>;
}

export const orderRepository: OrderRepository = {

  async create(order) {
    await pgPool.query(
      `INSERT INTO orders (id, token_in, token_out, amount, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, order.tokenIn, order.tokenOut, order.amount, order.status]
    );
  },

  async updateStatus(id, status, data) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${++idx}`);
      values.push(value);
    }

    await pgPool.query(
      `UPDATE orders
       SET status = $1 ${fields.length ? ', ' + fields.join(', ') : ''}
       WHERE id = $${++idx}`,
      [status, ...values, id]
    );
  },

  async findById(id) {
    const res = await pgPool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  },

  async findAll(limit = 20, offset = 0) {
    const res = await pgPool.query(
      `SELECT * FROM orders
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return res.rows;
  }
};
