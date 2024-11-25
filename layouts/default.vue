<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Top Navigation -->
    <nav class="bg-gray-800 h-[5vh] fixed w-full top-0 z-50">
      <div class="px-4 h-full flex items-center justify-between">
        <div class="flex items-center">
          <span class="material-icons text-blue-500 mr-2">dashboard</span>
          <h1 class="text-xl font-bold text-white">movWA</h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="material-icons text-gray-300">notifications</span>
          <span class="material-icons text-gray-300">account_circle</span>
        </div>
      </div>
    </nav>

    <div class="flex pt-[5vh]">
      <!-- Sidebar -->
      <div 
        class="bg-gray-800 min-h-[95vh] transition-all duration-300 fixed"
        :class="isExpanded ? 'w-64' : 'w-16'"
      >
        <button 
          @click="toggleSidebar"
          class="absolute -right-3 top-4 bg-gray-700 rounded-full p-1 hover:bg-gray-600"
        >
          <span 
            class="material-icons text-gray-300"
            :class="{ 'rotate-180': !isExpanded }"
          >
            chevron_left
          </span>
        </button>

        <div class="p-4">
          <nav class="space-y-2">
            <NuxtLink
              v-for="(item, index) in navItems"
              :key="index"
              :to="item.path"
              class="flex items-center px-2 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
              :class="{ 'bg-gray-700': route.path === item.path }"
            >
              <span class="material-icons mr-3">{{ item.icon }}</span>
              <span v-show="isExpanded">{{ item.name }}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div 
        class="flex-1 transition-all duration-300"
        :class="isExpanded ? 'ml-64' : 'ml-16'"
      >
        <main class="p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const isExpanded = ref(true)

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Captura de Movimientos', path: '/movements/capture', icon: 'sync_alt' },
  { name: 'Solicitudes de devolución', path: '/treasury/requests', icon: 'account_balance' }
]

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}
</script>