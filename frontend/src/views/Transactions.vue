<script setup>
import { ref, computed } from 'vue'
import { useTransactions } from '../composables/useTransactions'

const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()

const searchVal = ref('')
const filterType = ref('All')

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(searchVal.value.toLowerCase()) || t.category.toLowerCase().includes(searchVal.value.toLowerCase())
    const matchType = (filterType.value === 'All') || (t.type === filterType.value)
    return matchSearch && matchType
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const formatCurrency = (amount) => 'à¸¿' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Form state
const isEditing = ref(false)
const formData = ref({ id: '', description: '', amount: '', type: '', category: '', date: '', notes: '' })

const editTxn = (t) => {
  isEditing.value = true
  formData.value = { ...t }
}

const saveTxn = () => {
  if (isEditing.value) {
    updateTransaction(formData.value.id, formData.value)
  } else {
    addTransaction(formData.value)
  }
  cancelEdit()
}

const cancelEdit = () => {
  isEditing.value = false
  formData.value = { id: '', description: '', amount: '', type: '', category: '', date: '', notes: '' }
}

const removeTxn = (id) => {
  if (confirm('Delete?')) deleteTransaction(id)
}
</script>

<template>
  <div class="grid-layout">
    <div class="main-column">
      <section class="form-section">
        <div class="section-header">
          <h2>{{ isEditing ? 'Edit Transaction' : 'Add New Transaction' }}</h2>
        </div>
        <form class="transaction-form" @submit.prevent="saveTxn">
          <div class="form-group">
              <label>Description *</label>
              <input type="text" v-model="formData.description" required>
          </div>
          <div class="form-group-row">
              <div class="form-group">
                  <label>Amount (à¸¿) *</label>
                  <input type="number" v-model="formData.amount" min="0.01" step="0.01" required>
              </div>
              <div class="form-group">
                  <label>Date *</label>
                  <input type="date" v-model="formData.date" required>
              </div>
          </div>
          <div class="form-group-row">
              <div class="form-group">
                  <label>Type *</label>
                  <select v-model="formData.type" required>
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                  </select>
              </div>
              <div class="form-group">
                  <label>Category *</label>
                  <select v-model="formData.category" required>
                      <option value="Salary">Salary</option>
                      <option value="Food">Food</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Shopping">Shopping</option>
                  </select>
              </div>
          </div>
          <div class="form-actions">
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Save' }}</button>
              <button type="button" class="btn btn-secondary" v-if="isEditing" @click="cancelEdit">Cancel</button>
          </div>
        </form>
      </section>

      <section class="transactions-section">
        <div class="controls-bar">
            <input type="text" v-model="searchVal" placeholder="Search..." class="search-box">
            <select v-model="filterType">
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
            </select>
        </div>
        <div class="table-container">
          <table class="transaction-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in filteredTransactions" :key="t.id">
                    <td>{{ new Date(t.date).toLocaleDateString() }}</td>
                    <td>{{ t.description }}</td>
                    <td>{{ t.category }}</td>
                    <td class="amount" :class="t.type === 'Income' ? 'positive' : 'negative'">{{ formatCurrency(t.amount) }}</td>
                    <td>
                        <button class="btn-icon" @click="editTxn(t)"><span class="material-symbols-rounded">edit</span></button>
                        <button class="btn-icon delete" @click="removeTxn(t.id)"><span class="material-symbols-rounded">delete</span></button>
                    </td>
                </tr>
                <tr v-if="filteredTransactions.length === 0">
                  <td colspan="5" style="text-align: center;">No transactions found.</td>
                </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
