<template>
  <div class="bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-100">{{ title }}</h2>
      <span class="material-icons text-gray-400">{{ icon }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'dashboard'
  }
})
</script>