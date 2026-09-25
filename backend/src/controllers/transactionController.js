import db from '../config/db.js';

export const getAllTransactions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM transactions ORDER BY date DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTransaction = async (req, res) => {
    try {
        const { description, amount, type, category, date, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO transactions (user_id, description, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [1, description, amount, type, category, date, notes || ''] // Hardcoded user_id=1 for now (Stage 5)
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, type, category, date, notes } = req.body;
        const [result] = await db.query(
            'UPDATE transactions SET description=?, amount=?, type=?, category=?, date=?, notes=? WHERE id=?',
            [description, amount, type, category, date, notes || '', id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM transactions WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
