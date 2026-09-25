import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import transactionRoutes from './routes/transactionRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initDb } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all route for Vue Router history mode
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Global Error Handling Middleware
app.use(errorHandler);

// Initialize DB then start server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize database:", err);
});
