<template>
  <div class="p-6">
    <div class="flex items-center mb-6">
      <button @click="router.back()" 
              class="text-gray-300 hover:text-white mr-4">
        <span class="material-icons">arrow_back</span>
      </button>
      <h1 class="text-2xl font-bold text-white">Detalle de Solicitud</h1>
    </div>

    <div v-if="pending">
      <p class="text-white">Cargando...</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Error al cargar el movimiento</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Movement Details -->
      <div class="bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Información del Movimiento</h2>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-400">Folio Interno:</span>
            <span class="text-white font-medium">{{ `INT-${String(movement.id).padStart(3, '0')}` }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Folio:</span>
            <span class="text-white font-medium">{{ `FOL-${new Date(movement.fechaCreacion).getFullYear()}-${String(movement.id).padStart(3, '0')}` }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Empresa:</span>
            <span class="text-white font-medium">{{ formatRazonSocial(movement.razonSocial) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Sucursal:</span>
            <span class="text-white font-medium">{{ formatSucursal(movement.sucursal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Cuenta de Origen:</span>
            <span class="text-white font-medium">{{ movement.deLaCuenta }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Banco:</span>
            <span class="text-white font-medium">{{ formatBanco(movement.banco) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Cuenta Destino:</span>
            <span class="text-white font-medium">{{ movement.cuenta }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Importe:</span>
            <span class="text-white font-medium">{{ formatCurrency(movement.importe) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Fecha de Solicitud:</span>
            <span class="text-white font-medium">{{ formatDate(movement.fechaCreacion) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Observaciones:</span>
            <span class="text-white font-medium">{{ movement.observaciones }}</span>
          </div>
        </div>
      </div>

      <!-- Validation Section -->
      <div class="bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Validación</h2>
        
        <div class="space-y-4">
          <!-- File Upload -->
          <div class="border-2 border-dashed border-gray-600 rounded-lg p-4">
            <div class="text-center">
              <span class="material-icons text-4xl text-gray-400 mb-2">upload_file</span>
              <p class="text-gray-300 mb-2">Arrastra un archivo o</p>
              <label class="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                Selecciona un archivo
                <input type="file" class="hidden" @change="handleFileUpload">
              </label>
            </div>
          </div>

          <!-- Validation Status -->
          <div v-if="validationStatus" 
               :class="{'text-green-400': validationStatus === 'validated', 
                       'text-yellow-400': validationStatus === 'pending'}"
               class="flex items-center justify-center space-x-2">
            <span class="material-icons">
              {{ validationStatus === 'validated' ? 'check_circle' : 'pending' }}
            </span>
            <span>{{ validationStatus === 'validated' ? 'Validado' : 'Pendiente de validación' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const validationStatus = ref('pending')

const { data: movement, pending, error } = await useFetch(`/api/movimientos/${route.params.id}`)

const formatSucursal = (sucursal) => {
  const sucursales = {
    'cdmx': 'Ciudad de México',
    'gdl': 'Guadalajara',
    'mty': 'Monterrey'
  }
  return sucursales[sucursal] || sucursal
}

const formatBanco = (banco) => {
  const bancos = {
    'bbva': 'BBVA',
    'santander': 'Santander',
    'banamex': 'Banamex'
  }
  return bancos[banco] || banco
}

const formatRazonSocial = (razonSocial) => {
  const companies = {
    'comp1': 'Compañía 1',
    'comp2': 'Compañía 2',
    'comp3': 'Compañía 3'
  }
  return companies[razonSocial] || razonSocial
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // TODO: Implement actual file upload logic
    console.log('Uploading file:', file.name)
    // Simulate validation success
    setTimeout(() => {
      validationStatus.value = 'validated'
    }, 1500)
  }
}
</script>