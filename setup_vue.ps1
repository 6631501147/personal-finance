$dir = "C:\Users\acer\.gemini\antigravity-ide\scratch\Finance\frontend"

# Copy CSS
Copy-Item -Path "C:\Users\acer\.gemini\antigravity-ide\scratch\Finance\css\style.css" -Destination "$dir\src\style.css" -Force

# Create index.html
@"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Personal Finance Dashboard (Vue)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
"@ | Out-File -FilePath "$dir\index.html" -Encoding utf8

# Create composables dir
New-Item -Path "$dir\src\composables" -ItemType Directory -Force
New-Item -Path "$dir\src\router" -ItemType Directory -Force
New-Item -Path "$dir\src\views" -ItemType Directory -Force

@"
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
"@ | Out-File -FilePath "$dir\src\composables\useTransactions.js" -Encoding utf8

@"
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/transactions', name: 'Transactions', component: () => import('../views/Transactions.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
"@ | Out-File -FilePath "$dir\src\router\index.js" -Encoding utf8

@"
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
"@ | Out-File -FilePath "$dir\src\main.js" -Encoding utf8

@"
<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }
</script>

<template>
  <div class="dashboard-container">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    <main class="main-content">
      <Header @toggle-sidebar="toggleSidebar" />
      <div class="dashboard-content">
        <router-view />
      </div>
    </main>
  </div>
</template>
"@ | Out-File -FilePath "$dir\src\App.vue" -Encoding utf8

@"
<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
</script>

<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-header">
        <div class="logo">
            <span class="material-symbols-rounded">account_balance_wallet</span>
            <h2>FinDash</h2>
        </div>
        <button class="close-btn" @click="emit('close')">
            <span class="material-symbols-rounded">close</span>
        </button>
    </div>
    
    <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" active-class="active">
            <span class="material-symbols-rounded">dashboard</span>
            <span>Dashboard</span>
        </router-link>
        <router-link to="/transactions" class="nav-item" active-class="active">
            <span class="material-symbols-rounded">receipt_long</span>
            <span>Transactions</span>
        </router-link>
    </nav>
  </aside>
</template>
"@ | Out-File -FilePath "$dir\src\components\Sidebar.vue" -Encoding utf8

@"
<script setup>
import { defineEmits, ref, onMounted } from 'vue'

const emit = defineEmits(['toggle-sidebar'])
const currentDate = ref('')

onMounted(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  currentDate.value = new Date().toLocaleDateString('en-US', options)
})
</script>

<template>
  <header class="top-header">
      <div class="header-left">
          <button class="menu-btn" @click="emit('toggle-sidebar')">
              <span class="material-symbols-rounded">menu</span>
          </button>
          <div>
              <h1 class="page-title">{{ `$route.name` }}</h1>
              <p class="current-date">{{ currentDate }}</p>
          </div>
      </div>
  </header>
</template>
"@ | Out-File -FilePath "$dir\src\components\Header.vue" -Encoding utf8

@"
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
  amount: [String, Number],
  icon: String,
  colorClass: String
})
</script>

<template>
  <div class="card">
      <div class="card-icon" :class="colorClass">
          <span class="material-symbols-rounded">{{ icon }}</span>
      </div>
      <div class="card-details">
          <h3>{{ title }}</h3>
          <h2>{{ amount }}</h2>
      </div>
  </div>
</template>
"@ | Out-File -FilePath "$dir\src\components\SummaryCard.vue" -Encoding utf8

@"
<script setup>
import { useTransactions } from '../composables/useTransactions'
import SummaryCard from '../components/SummaryCard.vue'

const { totalBalance, totalIncome, totalExpenses, savingsRate } = useTransactions()

const formatCurrency = (amount) => {
    return '฿' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div>
    <section class="summary-cards">
        <SummaryCard title="Total Balance" :amount="formatCurrency(totalBalance)" icon="account_balance_wallet" colorClass="balance" />
        <SummaryCard title="Income" :amount="formatCurrency(totalIncome)" icon="arrow_upward" colorClass="income" />
        <SummaryCard title="Expenses" :amount="formatCurrency(totalExpenses)" icon="arrow_downward" colorClass="expense" />
        <SummaryCard title="Savings Rate" :amount="savingsRate.toFixed(1) + '%'" icon="savings" colorClass="savings" />
    </section>
    <div class="grid-layout">
        <div class="main-column">
            <section class="transactions-section">
                <div class="section-header">
                    <h2>Manage your finances</h2>
                    <router-link to="/transactions" class="view-all">Go to Transactions &rarr;</router-link>
                </div>
            </section>
        </div>
    </div>
  </div>
</template>
"@ | Out-File -FilePath "$dir\src\views\Dashboard.vue" -Encoding utf8

@"
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

const formatCurrency = (amount) => '฿' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
                  <label>Amount (฿) *</label>
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
"@ | Out-File -FilePath "$dir\src\views\Transactions.vue" -Encoding utf8
