<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['toggle'])
const route = useRoute()
const currentDate = ref('')

onMounted(() => {
  const d = new Date()
  currentDate.value = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="menu-toggle" @click="emit('toggle')">
        <span class="material-symbols-rounded">menu</span>
      </button>
      <div class="page-info">
        <div class="page-name">{{ route.name }}</div>
        <div class="page-date">{{ currentDate }}</div>
      </div>
    </div>
    <div class="topbar-right">
      <div class="topbar-badge">
        <span class="live-dot"></span>
        Live Data
      </div>
    </div>
  </header>
</template>
