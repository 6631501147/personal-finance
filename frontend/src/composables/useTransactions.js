import { ref, computed } from 'vue'
import { settingsState } from '../store'

const transactions = ref([])
const API_URL = import.meta.env.PROD ? '/api/transactions' : 'http://localhost:3000/api/transactions'

export function useTransactions() {
  const fetchTransactions = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      transactions.value = data
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    }
  }

  const addTransaction = async (txn) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txn)
      })
      const data = await res.json()
      transactions.value.push(data)
    } catch (err) {
      console.error('Failed to add transaction:', err)
    }
  }

  const updateTransaction = async (id, updatedTxn) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTxn)
      })
      const data = await res.json()
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) transactions.value[index] = data
    } catch (err) {
      console.error('Failed to update transaction:', err)
    }
  }

  const deleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (err) {
      console.error('Failed to delete transaction:', err)
    }
  }

  const totalIncome = computed(() => transactions.value.filter(t => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0))
  const totalExpenses = computed(() => transactions.value.filter(t => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0))
  const totalBalance = computed(() => totalIncome.value - totalExpenses.value)
  const savingsRate = computed(() => totalIncome.value > 0 ? ((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100 : 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settingsState.currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Fetch immediately
  fetchTransactions()

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    totalBalance,
    savingsRate,
    formatCurrency
  }
}
