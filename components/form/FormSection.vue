<template>
  <div class="bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center mb-4">
      <span class="material-icons text-gray-400 mr-2">{{ icon }}</span>
      <h2 class="text-lg font-semibold text-gray-100">{{ title }}</h2>
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
    required: true
  }
})
</script>