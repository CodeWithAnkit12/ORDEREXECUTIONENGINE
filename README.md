🧠 Order Execution Engine (Backend Task)
📌 Overview

This project implements a market order execution engine with DEX routing, real-time WebSocket updates, queue-based concurrency, and PostgreSQL persistence.
The system simulates order execution across Raydium and Meteora DEXs, selects the best execution venue, and streams live order status updates to clients.

The focus of this implementation is architecture, reliability, and real-time behavior, not blockchain integration.

🎯 Chosen Order Type: Market Order

Why Market Order?
Market orders best demonstrate immediate execution, real-time lifecycle updates, and DEX routing logic without introducing additional triggers or waiting conditions.

Extensibility:

Limit Orders can be added by introducing price-threshold checks before execution.

Sniper Orders can be added by triggering execution on external events (token launch/migration).

🏗 Architecture

Tech Stack

Node.js + TypeScript

Fastify (HTTP + WebSocket)

BullMQ + Redis (queue, retries, concurrency)

PostgreSQL (order history & auditing)

Docker (Redis & PostgreSQL)

Client
  │
  ├── POST /api/orders/execute
  │
  ├── WebSocket /ws/orders/:orderId
  │
Fastify API
  │
  ├── BullMQ Queue
  │       ├── Retry (Exponential Backoff)
  │       └── Concurrency (10 workers)
  │
  ├── DEX Router
  │       ├── Raydium (mock)
  │       └── Meteora (mock)
  │
  └── PostgreSQL (Order persistence)

🔁 Order Lifecycle
pending → routing → building → submitted → confirmed / failed


Each state transition is:

Emitted via WebSocket

Logged for transparency

Persisted in PostgreSQL

🔀 DEX Routing Logic

Fetch quotes from Raydium and Meteora

Compare effective prices

Select the best execution venue

Log routing decision

Execute swap (mocked)

Mocked price variance simulates real-world liquidity differences.

📡 WebSocket Updates

Each order streams live updates through WebSocket:

{ "status": "pending" }
{ "status": "routing" }
{ "status": "building", "dex": "raydium" }
{ "status": "submitted" }
{ "status": "confirmed", "txHash": "0xMOCK123" }


Failures are also streamed with error details.

🔁 Reliability & Error Handling

BullMQ Queue

Up to 10 concurrent orders

Handles 100+ orders/min

Retry Strategy

Max 3 attempts

Exponential backoff (1s → 2s → 4s)

Failure Handling

Final failure emits failed status

Error reason persisted for post-mortem analysis

🧾 API Endpoints
Execute Order
POST /api/orders/execute

{
  "tokenIn": "SOL",
  "tokenOut": "USDC",
  "amount": 1
}


Response:

{ "orderId": "uuid" }

Get All Orders (Pagination Supported)
GET /api/orders?limit=20&offset=0

Get Order by ID
GET /api/orders/:id

WebSocket
WS /ws/orders/:orderId

🗄 Database Schema
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  token_in TEXT,
  token_out TEXT,
  amount NUMERIC,
  status TEXT,
  dex TEXT,
  executed_price NUMERIC,
  tx_hash TEXT,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

🚀 Running Locally
Prerequisites

Node.js ≥ 18

Docker

Start Redis
docker run -d -p 6379:6379 redis

Start PostgreSQL
docker run -d \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=orders_db \
  -p 5432:5432 postgres:15

Install & Run
npm install
npm run dev
npm run worker

🧪 Testing

Unit tests cover:

DEX routing logic

Queue behavior

Retry & failure handling

Integration tests cover:

API lifecycle

WebSocket streaming

npm test