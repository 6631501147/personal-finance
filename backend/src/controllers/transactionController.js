// In-memory data store for Stage 4
let transactions = [];

export const getAllTransactions = (req, res) => {
    res.status(200).json(transactions);
};

export const getTransactionById = (req, res) => {
    const { id } = req.params;
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
};

export const createTransaction = (req, res) => {
    const newTransaction = {
        id: Date.now().toString(),
        ...req.body
    };
    
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
};

export const updateTransaction = (req, res) => {
    const { id } = req.params;
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Transaction not found' });
    }
    
    transactions[index] = { ...transactions[index], ...req.body, id };
    res.status(200).json(transactions[index]);
};

export const deleteTransaction = (req, res) => {
    const { id } = req.params;
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Transaction not found' });
    }
    
    transactions.splice(index, 1);
    res.status(200).json({ message: 'Transaction deleted successfully' });
};
