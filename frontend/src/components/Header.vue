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
              <h1 class="page-title">{{ $route.name }}</h1>
              <p class="current-date">{{ currentDate }}</p>
          </div>
      </div>
  </header>
</template>
