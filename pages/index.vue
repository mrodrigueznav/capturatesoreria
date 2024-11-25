<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-white">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="bg-gray-800 p-6 rounded-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-300">{{ stat.title }}</h3>
          <span class="material-icons text-blue-500">{{ stat.icon }}</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
        <p class="text-sm text-gray-400">{{ stat.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  {
    title: 'Total Users',
    value: '1,234',
    description: '12% increase from last month',
    icon: 'group'
  },
  {
    title: 'Revenue',
    value: '$12,345',
    description: '8% increase from last month',
    icon: 'attach_money'
  },
  {
    title: 'Active Projects',
    value: '42',
    description: '3 new this week',
    icon: 'work'
  }
]
</script>