# Personal Finance Dashboard Backend

This is the Express.js REST API for the Personal Finance Dashboard.

## Endpoints

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## How to run
1. Ensure you have Node.js installed.
2. Run `npm install` to install dependencies (express, cors, dotenv).
3. Run `npm run dev` to start the server on port 3000 using Nodemon (auto-restarts on file changes).
4. The API will be available at `http://localhost:3000`
