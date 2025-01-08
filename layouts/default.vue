<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Top Navigation -->
    <nav class="bg-gray-800 h-[5vh] fixed w-full top-0 z-50">
      <div class="px-4 h-full flex items-center justify-between">
        <div class="flex items-center">
          <span class="material-icons text-blue-500 mr-2">dashboard</span>
          <h1 class="text-xl font-bold text-white">movWA</h1>
        </div>
        <div class="relative">
          <div 
            class="flex items-center space-x-2 cursor-pointer" 
            @click="toggleDropdown"
          >
            <span class="text-gray-300">{{ name }}</span>
            <span class="material-icons text-gray-300">account_circle</span>
          </div>

          <!-- Dropdown Menu -->
          <div 
            v-show="isDropdownOpen" 
            class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <button 
              @click="logout"
              class="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
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
import { ref, onMounted, computed } from 'vue'
const route = useRoute()
const isExpanded = ref(true)
const name = ref('') // Ref for storing the user name
const pAppV = ref(0) // Ref for storing the pAppV value
const isDropdownOpen = ref(false) // Ref for dropdown visibility

// All navigation items
const allNavItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Captura de Solicitud', path: '/contraloria/capture', icon: 'sync_alt' },
  { name: 'Solicitudes de devolución T', path: '/treasury/requests', icon: 'account_balance' },
  { name: 'Validacion de devolución C', path: '/treasury/validation', icon: 'account_balance' }
]

// Filter navItems based on pAppV value
const navItems = computed(() => {
  if (pAppV.value === '0') {
    return allNavItems // Render all items
  }

  return allNavItems.filter(item => {
    if (item.name === 'Dashboard') return true // Always include Dashboard
    if (pAppV.value === '1' && item.name === 'Captura de Movimientos') return true
    if (pAppV.value === '2' && item.name === 'Solicitudes de devolución T') return true
    if (pAppV.value === '3' && item.name === 'Validacion de devolución C') return true
    return false
  })
})

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('pAppV')
  name.value = 'Guest'
  pAppV.value = '0'
  isDropdownOpen.value = false
  // Redirect to login page or take any other action
  window.location.href = 'auth/login'
}

// Retrieve the 'nombre' and 'pAppV' variables from localStorage on component mount
onMounted(() => {
  const storedName = localStorage.getItem('nombre')
  name.value = storedName || 'ERROR' // Default to 'Guest' if not found
  
  const storedPAppV = localStorage.getItem('pAppV')
  pAppV.value = storedPAppV || '9' // Default to '0' if not found
})
</script>
