<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-white">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Stats Cards -->
      <div 
        v-for="(stat, index) in computedStats" 
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

    <!-- Loading state for table -->
    <div v-if="loading" class="mt-6 text-white">
      Cargando movimientos...
    </div>
    <div v-else-if="error" class="mt-6 text-red-500">
      Error al cargar los movimientos: {{ error }}
    </div>
    <MovementsTable 
      v-else 
      :movements="pendingMovements" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useMovements } from '~/composables/useMovements'
import { useRouter } from 'vue-router'

const router = useRouter()
const { fetchAllMovements } = useMovements()
const pendingMovements = ref([])
const loading = ref(true)
const error = ref(null)

// Compute statistics from movements data
const computedStats = computed(() => {
  if (!pendingMovements.value.length) {
    return defaultStats
  }

  const total = pendingMovements.value.length
  const totalAmount = pendingMovements.value.reduce((sum, mov) => sum + (mov.ImporteDevolucion || 0), 0)
  
  // Count movements by status
  const statusCounts = pendingMovements.value.reduce((acc, mov) => {
    acc[mov.WorkflowStatus] = (acc[mov.WorkflowStatus] || 0) + 1
    return acc
  }, {})

  // Get movements from today
  const today = new Date().toISOString().split('T')[0]
  const todayMovements = pendingMovements.value.filter(mov => 
    mov.createdAt.split('T')[0] === today
  ).length

  return [
    {
      title: 'Total Movimientos',
      value: total.toString(),
      description: `${todayMovements} nuevos hoy`,
      icon: 'swap_horiz'
    },
    {
      title: 'Importe Total',
      value: new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(totalAmount),
      description: 'Suma de todos los movimientos',
      icon: 'payments'
    },
    {
      title: 'En Alta/Baja',
      value: ((statusCounts[1] || 0) + (statusCounts[5] || 0)).toString(),
      description: 'Pendientes de procesar',
      icon: 'pending_actions'
    },
    {
      title: 'En Validación',
      value: ((statusCounts[2] || 0) + (statusCounts[4] || 0) + (statusCounts[6] || 0)).toString(),
      description: 'Esperando validación',
      icon: 'fact_check'
    }
  ]
})

// Default stats when no data is available
const defaultStats = [
  {
    title: 'Total Movimientos',
    value: '0',
    description: '0 nuevos hoy',
    icon: 'swap_horiz'
  },
  {
    title: 'Importe Total',
    value: '$0.00',
    description: 'Suma de todos los movimientos',
    icon: 'payments'
  },
  {
    title: 'En Alta/Baja',
    value: '0',
    description: 'Pendientes de procesar',
    icon: 'pending_actions'
  },
  {
    title: 'En Validación',
    value: '0',
    description: 'Esperando validación',
    icon: 'fact_check'
  }
]

// Fetch data on component mount
const fetchData = async () => {
  try {
    loading.value = true
    // Check for authentication
    if (!process.client) return // Skip on server-side
    
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    const { data, error: fetchError } = await fetchAllMovements()
    if (fetchError) throw new Error(fetchError)
    
    if (data) {
      pendingMovements.value = data
    }
  } catch (err) {
    error.value = err.message
    console.error('Error fetching movements:', err)
  } finally {
    loading.value = false
  }
}

// Watch for client-side mounting
onMounted(() => {
  if (process.client) {
    fetchData()
  }
})

// Refresh data periodically (optional)
let refreshInterval
onMounted(() => {
  if (process.client) {
    fetchData()
    // Refresh data every 30 seconds
    refreshInterval = setInterval(fetchData, 30000)
  }
})

// Clean up interval on component unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

definePageMeta({
  middleware: 'auth',
})
</script>