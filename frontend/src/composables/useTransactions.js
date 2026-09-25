import { ref, computed, watch } from 'vue'

const transactions = ref(JSON.parse(localStorage.getItem('finance_transactions')) || [])

watch(transactions, (newVal) => {
  localStorage.setItem('finance_transactions', JSON.stringify(newVal))
}, { deep: true })

export function useTransactions() {
  const addTransaction = (txn) => {
    transactions.value.push({ ...txn, id: Date.now().toString() })
  }

  const updateTransaction = (id, updatedTxn) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value[index] = { ...updatedTxn, id }
    }
  }

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const totalIncome = computed(() => transactions.value.filter(t => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0))
  const totalExpenses = computed(() => transactions.value.filter(t => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0))
  const totalBalance = computed(() => totalIncome.value - totalExpenses.value)
  const savingsRate = computed(() => totalIncome.value > 0 ? ((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100 : 0)

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    totalBalance,
    savingsRate
  }
}
