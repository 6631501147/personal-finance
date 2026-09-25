<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTransactions } from '../composables/useTransactions'

const { transactions, totalBalance, totalIncome, totalExpenses, savingsRate, formatCurrency } = useTransactions()

const fmt = formatCurrency

const recent = computed(() => [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6))

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

const savingsColor = computed(() => {
  if (savingsRate.value >= 30) return 'var(--success-light)'
  if (savingsRate.value >= 10) return 'var(--warning-light)'
  return 'var(--danger-light)'
})

const balanceTrend = computed(() => totalBalance.value >= 0 ? '↑ Positive balance' : '↓ Negative balance')
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="stat-card balance">
        <div class="stat-top">
          <div>
            <div class="stat-label">Total Balance</div>
          </div>
          <div class="stat-icon">
            <span class="material-symbols-rounded">account_balance_wallet</span>
          </div>
        </div>
        <div class="stat-value">{{ fmt(totalBalance) }}</div>
        <div class="stat-sub" :class="totalBalance >= 0 ? 'positive' : 'negative'">{{ balanceTrend }}</div>
      </div>

      <div class="stat-card income">
        <div class="stat-top">
          <div>
            <div class="stat-label">Total Income</div>
          </div>
          <div class="stat-icon">
            <span class="material-symbols-rounded">trending_up</span>
          </div>
        </div>
        <div class="stat-value">{{ fmt(totalIncome) }}</div>
        <div class="stat-sub positive">{{ transactions.filter(t => t.type === 'Income').length }} income entries</div>
      </div>

      <div class="stat-card expense">
        <div class="stat-top">
          <div>
            <div class="stat-label">Total Expenses</div>
          </div>
          <div class="stat-icon">
            <span class="material-symbols-rounded">trending_down</span>
          </div>
        </div>
        <div class="stat-value">{{ fmt(totalExpenses) }}</div>
        <div class="stat-sub negative">{{ transactions.filter(t => t.type === 'Expense').length }} expense entries</div>
      </div>

      <div class="stat-card savings">
        <div class="stat-top">
          <div>
            <div class="stat-label">Savings Rate</div>
          </div>
          <div class="stat-icon">
            <span class="material-symbols-rounded">savings</span>
          </div>
        </div>
        <div class="stat-value">{{ savingsRate.toFixed(1) }}%</div>
        <div class="stat-sub" :class="savingsRate >= 20 ? 'positive' : 'negative'">
          {{ savingsRate >= 20 ? '🎯 Great saving pace!' : savingsRate > 0 ? '📈 Keep going!' : 'No income yet' }}
        </div>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="dash-grid">
      <!-- Recent Transactions -->
      <div class="section-card">
        <div class="section-head">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your latest financial activity</p>
          </div>
          <RouterLink to="/transactions" class="view-all-btn">
            View all <span class="material-symbols-rounded" style="font-size:16px;">arrow_forward</span>
          </RouterLink>
        </div>
        <div class="txn-list">
          <div v-if="recent.length === 0" class="empty-state">
            <div class="icon">🧾</div>
            <p>No transactions yet. Add your first one!</p>
          </div>
          <div v-for="t in recent" :key="t.id" class="txn-item">
            <div class="txn-cat-icon" :class="getCatMeta(t.category).cls">
              {{ getCatMeta(t.category).icon }}
            </div>
            <div class="txn-info">
              <div class="txn-desc">{{ t.description }}</div>
              <div class="txn-meta">{{ t.category }} · {{ new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</div>
            </div>
            <div class="txn-amount" :class="t.type === 'Income' ? 'income' : 'expense'">
              {{ t.type === 'Income' ? '+' : '-' }}{{ fmt(t.amount) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Health Panel -->
      <div class="section-card">
        <div class="section-head">
          <div>
            <h2>Financial Health</h2>
            <p>Breakdown at a glance</p>
          </div>
        </div>
        <div class="quick-panel">
          <div class="progress-item">
            <div class="progress-label">
              <span>Income</span>
              <span style="color: var(--success-light)">{{ fmt(totalIncome) }}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar" style="background: var(--success); width: 100%;"></div>
            </div>
          </div>

          <div class="progress-item">
            <div class="progress-label">
              <span>Expenses</span>
              <span style="color: var(--danger-light)">{{ fmt(totalExpenses) }}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar" style="background: var(--danger);"
                :style="{ width: totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) + '%' : '0%' }">
              </div>
            </div>
          </div>

          <div class="progress-item">
            <div class="progress-label">
              <span>Savings</span>
              <span :style="{ color: savingsColor }">{{ savingsRate.toFixed(1) }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar"
                :style="{ background: savingsColor, width: Math.max(0, savingsRate) + '%' }">
              </div>
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border);">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Quick Links</div>
            <RouterLink to="/transactions" style="display:flex; align-items:center; gap:8px; padding: 12px 14px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; font-size: 0.88rem; font-weight: 500; color: var(--accent-light); margin-bottom: 8px; transition: all 0.2s;">
              <span class="material-symbols-rounded" style="font-size:18px;">add_circle</span>
              Add New Transaction
            </RouterLink>
            <RouterLink to="/reports" style="display:flex; align-items:center; gap:8px; padding: 12px 14px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 10px; font-size: 0.88rem; font-weight: 500; color: var(--success-light); transition: all 0.2s;">
              <span class="material-symbols-rounded" style="font-size:18px;">bar_chart_4_bars</span>
              View Reports & Charts
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
