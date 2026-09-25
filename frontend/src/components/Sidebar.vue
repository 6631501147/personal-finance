<script setup>

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
