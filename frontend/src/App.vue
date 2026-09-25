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
