<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
  PointElement, LineElement, Filler
} from 'chart.js'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import { useTransactions } from '../composables/useTransactions'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler)

const { transactions, totalIncome, totalExpenses, totalBalance, savingsRate, formatCurrency } = useTransactions()

const fmt = formatCurrency

const catColors = {
  Salary: '#10b981', Food: '#f59e0b', Transportation: '#3b82f6',
  Shopping: '#8b5cf6', Bills: '#ef4444', Entertainment: '#ec4899', Other: '#94a3b8'
}

// Donut: expenses by category
const donutData = computed(() => {
  const cats = {}
  transactions.value.filter(t => t.type === 'Expense').forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + parseFloat(t.amount)
  })
  const labels = Object.keys(cats)
  return {
    labels,
    datasets: [{
      data: Object.values(cats),
      backgroundColor: labels.map(l => catColors[l] || '#94a3b8'),
      borderWidth: 2,
      borderColor: '#0d1020',
      hoverBorderWidth: 3
    }]
  }
})

// Bar: income vs expenses by month
const barData = computed(() => {
  const months = {}
  transactions.value.forEach(t => {
    const key = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!months[key]) months[key] = { income: 0, expense: 0 }
    if (t.type === 'Income') months[key].income += parseFloat(t.amount)
    else months[key].expense += parseFloat(t.amount)
  })
  const labels = Object.keys(months).slice(-6)
  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: labels.map(l => months[l]?.income || 0),
        backgroundColor: 'rgba(16,185,129,0.7)',
        borderRadius: 6, borderSkipped: false
      },
      {
        label: 'Expenses',
        data: labels.map(l => months[l]?.expense || 0),
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderRadius: 6, borderSkipped: false
      }
    ]
  }
})

// Line: running balance over time
const lineData = computed(() => {
  const sorted = [...transactions.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  let running = 0
  const points = sorted.map(t => {
    running += t.type === 'Income' ? parseFloat(t.amount) : -parseFloat(t.amount)
    return { x: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), y: running }
  })
  return {
    labels: points.map(p => p.x),
    datasets: [{
      label: 'Balance',
      data: points.map(p => p.y),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4
    }]
  }
})

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111627',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8'
    }
  }
}

const donutOpts = {
  ...chartOpts,
  plugins: {
    ...chartOpts.plugins,
    legend: {
      display: true, position: 'bottom',
      labels: { color: '#94a3b8', padding: 16, boxWidth: 12, borderRadius: 4 }
    }
  }
}

const barOpts = {
  ...chartOpts,
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', callback: v => formatCurrency(v) } }
  },
  plugins: { ...chartOpts.plugins, legend: { display: true, labels: { color: '#94a3b8', padding: 16, boxWidth: 12 } } }
}

const lineOpts = {
  ...chartOpts,
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', callback: v => formatCurrency(v) } }
  }
}

const hasData = computed(() => transactions.value.length > 0)
const hasExpenses = computed(() => transactions.value.some(t => t.type === 'Expense'))
</script>

<template>
  <div>
    <!-- Summary row -->
    <div class="summary-grid" style="margin-bottom:28px;">
      <div class="stat-card balance">
        <div class="stat-top">
          <div class="stat-label">Net Balance</div>
          <div class="stat-icon"><span class="material-symbols-rounded">account_balance_wallet</span></div>
        </div>
        <div class="stat-value">{{ fmt(totalBalance) }}</div>
        <div class="stat-sub" :class="totalBalance >= 0 ? 'positive' : 'negative'">{{ totalBalance >= 0 ? 'Positive net worth' : 'Negative net worth' }}</div>
      </div>
      <div class="stat-card income">
        <div class="stat-top">
          <div class="stat-label">Total Income</div>
          <div class="stat-icon"><span class="material-symbols-rounded">trending_up</span></div>
        </div>
        <div class="stat-value">{{ fmt(totalIncome) }}</div>
        <div class="stat-sub positive">All time earnings</div>
      </div>
      <div class="stat-card expense">
        <div class="stat-top">
          <div class="stat-label">Total Expenses</div>
          <div class="stat-icon"><span class="material-symbols-rounded">trending_down</span></div>
        </div>
        <div class="stat-value">{{ fmt(totalExpenses) }}</div>
        <div class="stat-sub negative">All time spending</div>
      </div>
      <div class="stat-card savings">
        <div class="stat-top">
          <div class="stat-label">Savings Rate</div>
          <div class="stat-icon"><span class="material-symbols-rounded">savings</span></div>
        </div>
        <div class="stat-value">{{ savingsRate.toFixed(1) }}%</div>
        <div class="stat-sub" :class="savingsRate >= 20 ? 'positive' : 'negative'">Of income saved</div>
      </div>
    </div>

    <!-- No data notice -->
    <div v-if="!hasData" class="section-card" style="padding:60px; text-align:center; color:var(--text-muted);">
      <div style="font-size:48px; margin-bottom:16px;">📊</div>
      <div style="font-size:1rem; margin-bottom:8px;">No data to display yet</div>
      <div style="font-size:0.85rem;">Add transactions on the <router-link to="/transactions" style="color:var(--accent-light);">Transactions page</router-link> to see your analytics charts here.</div>
    </div>

    <template v-else>
      <!-- Row 1 -->
      <div class="reports-grid">
        <!-- Donut chart -->
        <div class="chart-card">
          <div class="chart-title">Expense Breakdown</div>
          <div class="chart-sub">Where your money is going</div>
          <div class="chart-box">
            <Doughnut v-if="hasExpenses" :data="donutData" :options="donutOpts" />
            <div v-else style="color:var(--text-muted); font-size:0.88rem;">No expenses recorded yet.</div>
          </div>
        </div>

        <!-- Bar chart -->
        <div class="chart-card">
          <div class="chart-title">Income vs Expenses</div>
          <div class="chart-sub">Monthly comparison</div>
          <div class="chart-box">
            <Bar :data="barData" :options="barOpts" />
          </div>
        </div>
      </div>

      <!-- Row 2: Line chart full width -->
      <div class="chart-card">
        <div class="chart-title">Balance Over Time</div>
        <div class="chart-sub">Running net balance trend across all transactions</div>
        <div class="chart-box" style="height:260px;">
          <Line :data="lineData" :options="lineOpts" />
        </div>
      </div>
    </template>
  </div>
</template>
