<script setup>
defineProps(['open'])
const emit = defineEmits(['close'])

const catIcons = {
  Salary: { icon: '💰', cls: 'cat-salary' },
  Food: { icon: '🍜', cls: 'cat-food' },
  Transportation: { icon: '🚌', cls: 'cat-transport' },
  Shopping: { icon: '🛍️', cls: 'cat-shopping' },
  Bills: { icon: '🧾', cls: 'cat-bills' },
  Entertainment: { icon: '🎬', cls: 'cat-entertainment' },
  Other: { icon: '📦', cls: 'cat-other' },
}
</script>

<template>
  <aside class="sidebar" :class="{ open }">
    <div class="sidebar-logo">
      <div class="logo-icon">💹</div>
      <div class="logo-text">
        <span class="brand">FinDash</span>
        <span class="tagline">Smart Finance Tracker</span>
      </div>
      <button class="sidebar-close" @click="emit('close')">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <span class="nav-section-label">Main Menu</span>

      <router-link to="/" class="nav-link" active-class="active" exact-active-class="active">
        <span class="material-symbols-rounded nav-icon">dashboard</span>
        <span>Dashboard</span>
      </router-link>

      <router-link to="/transactions" class="nav-link" active-class="active">
        <span class="material-symbols-rounded nav-icon">receipt_long</span>
        <span>Transactions</span>
      </router-link>

      <router-link to="/reports" class="nav-link" active-class="active">
        <span class="material-symbols-rounded nav-icon">bar_chart_4_bars</span>
        <span>Reports</span>
      </router-link>

      <span class="nav-section-label">Settings</span>

      <router-link to="/profile" class="nav-link" active-class="active">
        <span class="material-symbols-rounded nav-icon">manage_accounts</span>
        <span>Profile</span>
      </router-link>

      <router-link to="/settings" class="nav-link" active-class="active">
        <span class="material-symbols-rounded nav-icon">settings</span>
        <span>Settings</span>
      </router-link>
    </nav>

    <div class="sidebar-user">
      <div class="user-avatar">JD</div>
      <div class="user-info">
        <div class="name">John Doe</div>
        <div class="role">Personal Account</div>
      </div>
    </div>
  </aside>
</template>
