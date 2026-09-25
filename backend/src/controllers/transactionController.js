import { getDb } from '../config/db.js';

export const getAllTransactions = async (req, res) => {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM transactions ORDER BY date DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        const row = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
        if (!row) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTransaction = async (req, res) => {
    try {
        const db = await getDb();
        const { description, amount, type, category, date, notes } = req.body;
        const result = await db.run(
            'INSERT INTO transactions (user_id, description, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [1, description, amount, type, category, date, notes || '']
        );
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        const { description, amount, type, category, date, notes } = req.body;
        const result = await db.run(
            'UPDATE transactions SET description=?, amount=?, type=?, category=?, date=?, notes=? WHERE id=?',
            [description, amount, type, category, date, notes || '', id]
        );
        if (result.changes === 0) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        const result = await db.run('DELETE FROM transactions WHERE id = ?', [id]);
        if (result.changes === 0) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
