export const validateTransaction = (req, res, next) => {
    const { description, amount, type, category, date } = req.body;
    
    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Description is required and must be a string' });
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'Amount is required and must be a valid number' });
    }
    
    if (!type || !['Income', 'Expense'].includes(type)) {
        return res.status(400).json({ error: 'Type is required and must be Income or Expense' });
    }
    
    if (!category) {
        return res.status(400).json({ error: 'Category is required' });
    }
    
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }
    
    next();
};
