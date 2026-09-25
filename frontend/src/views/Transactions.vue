<script setup>
import { ref, computed } from 'vue'
import { useTransactions } from '../composables/useTransactions'

const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()

const fmt = (n) => '$' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const search = ref('')
const filterType = ref('All')
const filterCategory = ref('All')
const editing = ref(false)

const emptyForm = () => ({ id: '', description: '', amount: '', type: 'Expense', category: 'Food', date: new Date().toISOString().slice(0, 10), notes: '' })
const form = ref(emptyForm())

const filtered = computed(() => {
  return [...transactions.value].filter(t => {
    const s = search.value.toLowerCase()
    const matchSearch = !s || t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s)
    const matchType = filterType.value === 'All' || t.type === filterType.value
    const matchCat = filterCategory.value === 'All' || t.category === filterCategory.value
    return matchSearch && matchType && matchCat
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const catMeta = {
  Salary:         { icon: '💰', cls: 'cat-salary' },
  Food:           { icon: '🍜', cls: 'cat-food' },
  Transportation: { icon: '🚌', cls: 'cat-transport' },
  Shopping:       { icon: '🛍️', cls: 'cat-shopping' },
  Bills:          { icon: '🧾', cls: 'cat-bills' },
  Entertainment:  { icon: '🎬', cls: 'cat-entertainment' },
  Other:          { icon: '📦', cls: 'cat-other' },
}

const getCatMeta = (cat) => catMeta[cat] || catMeta.Other

const handleSubmit = async () => {
  if (!form.value.description || !form.value.amount || !form.value.date) return
  if (editing.value) {
    await updateTransaction(form.value.id, form.value)
  } else {
    await addTransaction(form.value)
  }
  form.value = emptyForm()
  editing.value = false
}

const editTxn = (t) => {
  form.value = { ...t }
  editing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteTxn = async (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    await deleteTransaction(id)
  }
}

const cancel = () => {
  form.value = emptyForm()
  editing.value = false
}
</script>

<template>
  <div>
    <!-- Add / Edit Form -->
    <div class="add-form-card">
      <div class="form-title">
        <span class="material-symbols-rounded title-icon">{{ editing ? 'edit_note' : 'add_circle' }}</span>
        {{ editing ? 'Edit Transaction' : 'New Transaction' }}
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-col">
            <div class="form-field">
              <label>Description *</label>
              <input v-model="form.description" type="text" placeholder="e.g. Monthly salary, Coffee..." required />
            </div>
            <div class="form-row" style="gap:12px">
              <div class="form-field">
                <label>Amount ($) *</label>
                <input v-model="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" required />
              </div>
              <div class="form-field">
                <label>Date *</label>
                <input v-model="form.date" type="date" required />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">
                <span class="material-symbols-rounded" style="font-size:18px; vertical-align: middle; margin-right:4px">{{ editing ? 'save' : 'add' }}</span>
                {{ editing ? 'Update Transaction' : 'Add Transaction' }}
              </button>
              <button v-if="editing" type="button" class="btn-cancel" @click="cancel">Cancel</button>
            </div>
          </div>
          <div class="form-col">
            <div class="form-row" style="gap:12px">
              <div class="form-field">
                <label>Type *</label>
                <select v-model="form.type" required>
                  <option value="Income">📈 Income</option>
                  <option value="Expense">📉 Expense</option>
                </select>
              </div>
              <div class="form-field">
                <label>Category *</label>
                <select v-model="form.category" required>
                  <option value="Salary">💰 Salary</option>
                  <option value="Food">🍜 Food</option>
                  <option value="Transportation">🚌 Transportation</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Bills">🧾 Bills</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>
            </div>
            <div class="form-field">
              <label>Notes (optional)</label>
              <textarea v-model="form.notes" rows="3" placeholder="Add any notes about this transaction..." style="resize:vertical; width:100%;"></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Filter Controls -->
    <div class="controls-row">
      <div class="search-wrap">
        <span class="material-symbols-rounded icon">search</span>
        <input v-model="search" type="text" placeholder="Search transactions..." />
      </div>
      <select v-model="filterType" class="filter-select" style="width:auto">
        <option value="All">All Types</option>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>
      <select v-model="filterCategory" class="filter-select" style="width:auto">
        <option value="All">All Categories</option>
        <option value="Salary">Salary</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <!-- Transactions Table -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="6">
              <div class="empty-state">
                <div class="icon">🔍</div>
                <p>{{ transactions.length === 0 ? 'No transactions yet. Add your first transaction above!' : 'No results match your search.' }}</p>
              </div>
            </td>
          </tr>
          <tr v-for="t in filtered" :key="t.id">
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px;" :class="getCatMeta(t.category).cls">{{ getCatMeta(t.category).icon }}</span>
                <span class="badge category">{{ t.category }}</span>
              </div>
            </td>
            <td>
              <div style="font-weight:500">{{ t.description }}</div>
              <div v-if="t.notes" style="font-size:0.76rem; color: var(--text-muted); margin-top:2px;">{{ t.notes }}</div>
            </td>
            <td style="color: var(--text-secondary);">{{ new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</td>
            <td><span class="badge" :class="t.type === 'Income' ? 'income' : 'expense'">{{ t.type === 'Income' ? '↑' : '↓' }} {{ t.type }}</span></td>
            <td><span class="cell-amount" :class="t.type === 'Income' ? 'income' : 'expense'">{{ t.type === 'Income' ? '+' : '-' }}{{ fmt(t.amount) }}</span></td>
            <td>
              <div class="action-btns">
                <button class="btn-action edit" title="Edit" @click="editTxn(t)">
                  <span class="material-symbols-rounded">edit</span>
                </button>
                <button class="btn-action del" title="Delete" @click="deleteTxn(t.id)">
                  <span class="material-symbols-rounded">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filtered.length > 0" style="margin-top:12px; font-size:0.78rem; color:var(--text-muted); text-align:right;">
      Showing {{ filtered.length }} of {{ transactions.length }} transactions
    </div>
  </div>
</template>
