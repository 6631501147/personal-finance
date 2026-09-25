<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="app-layout">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="main">
      <Topbar @toggle="sidebarOpen = !sidebarOpen" />
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>
