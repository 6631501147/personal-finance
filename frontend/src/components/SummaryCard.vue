<script setup>

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
