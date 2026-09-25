<script setup>
import { useTransactions } from '../composables/useTransactions'
import SummaryCard from '../components/SummaryCard.vue'

const { totalBalance, totalIncome, totalExpenses, savingsRate } = useTransactions()

const formatCurrency = (amount) => {
    return 'à¸¿' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
