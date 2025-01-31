<template>
  <div class="bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-white">Movimientos Pendientes</h2>
      <button 
        @click="exportToCSV"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        :disabled="!movements.length"
      >
        <span class="material-icons mr-2">download</span>
        Exportar CSV
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-if="!movements.length" class="text-gray-400 text-center py-8">
      No hay movimientos para mostrar
    </div>
    
    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-gray-700 rounded-lg">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Folio
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Empresa
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Sucursal
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Importe
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Fecha
            </th>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Acciones
            </th> -->
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-600">
          <tr v-for="movement in movements" :key="movement.id" class="hover:bg-gray-600">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ `FOL-${new Date(movement.createdAt).getFullYear()}-${String(movement.id).padStart(3, '0')}` }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ formatRazonSocial(movement.Empresa) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ formatSucursal(movement.Sucursal) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ formatCurrency(movement.ImporteDevolucion) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(movement.WorkflowStatus)">
                {{ formatStatus(movement.WorkflowStatus) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ formatDate(movement.createdAt) }}
            </td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              <NuxtLink 
                :to="`/contraloria/mov/${movement.id}`"
                class="text-blue-400 hover:text-blue-300"
              >
                Ver detalle
              </NuxtLink>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  movements: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formatRazonSocial = (razonSocial) => {
  const companies = {
    empresa1: 'Empresa 1',
    empresa2: 'Empresa 2',
  }
  return companies[razonSocial] || razonSocial
}

const formatSucursal = (sucursal) => {
  const sucursales = {
    MEXICO: 'México',
    GUADALAJARA: 'Guadalajara',
    MONTERREY: 'Monterrey',
  }
  return sucursales[sucursal] || sucursal
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatStatus = (status) => {
  const statuses = {
    1: 'Alta en Banca',
    2: 'Validación de Alta',
    3: 'Captura de Transferencia',
    4: 'Validación de Transferencia',
    5: 'Baja en Banca',
    6: 'Confirmación de Baja',
    7: 'Completado'
  }
  return statuses[status] || status
}

const getStatusClass = (status) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
  const statusClasses = {
    1: 'bg-yellow-500',
    2: 'bg-yellow-500',
    3: 'bg-yellow-500',
    4: 'bg-yellow-500',
    5: 'bg-yellow-500',
    6: 'bg-yellow-500',
    7: 'bg-green-500'
  }
  return `${baseClasses} ${statusClasses[status] || ''}`
}

const exportToCSV = () => {
  // Define all possible headers
  const headers = [
    'Folio',
    'Empresa',
    'Sucursal',
    'PasivoAutorizacion',
    'Concepto',
    'RazonSocialDeposito',
    'ImporteDeposito',
    'CuentaSapCliente',
    'BancoDeposito',
    'CuentaDeposito',
    'ReferenciaDeposito',
    'TipoDevolucion',
    'ImporteDevolucion',
    'BancoOrigen',
    'CuentaOrigen',
    'BancoDestino',
    'CuentaDestino',
    'RazonSocialDevolucion',
    'Observaciones',
    'Estado',
    'Fecha Creación',
    'Última Actualización'
  ]

  // Format the data with all fields
  const csvData = props.movements.map(movement => [
    `FOL-${new Date(movement.createdAt).getFullYear()}-${String(movement.id).padStart(3, '0')}`,
    movement.Empresa,
    movement.Sucursal,
    movement.PasivoAutorizacion,
    movement.Concepto,
    movement.RazonSocialDeposito,
    movement.ImporteDeposito,
    movement.CuentaSapCliente,
    movement.BancoDeposito,
    movement.CuentaDeposito,
    movement.ReferenciaDeposito,
    movement.TipoDevolucion,
    movement.ImporteDevolucion,
    movement.BancoOrigen,
    movement.CuentaOrigen,
    movement.BancoDestino,
    movement.CuentaDestino,
    movement.RazonSocialDevolucion,
    movement.Observaciones,
    formatStatus(movement.WorkflowStatus),
    formatDate(movement.createdAt),
    formatDate(movement.updatedAt)
  ])

  // Add headers to the beginning
  csvData.unshift(headers)

  // Convert to CSV string with proper encoding for Spanish characters
  const csvString = csvData
    .map(row => 
      row.map(cell => {
        if (cell === null || cell === undefined) {
          return '""'
        }
        // Handle cells that contain commas, quotes, or special characters
        const cellString = cell.toString()
        if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
          return `"${cellString.replace(/"/g, '""')}"`
        }
        return cell
      }).join(',')
    )
    .join('\n')

  // Create blob and download with BOM for Excel
  const blob = new Blob(['\ufeff' + csvString], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `movimientos_completos_${formatDateForFilename(new Date())}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const formatDateForFilename = (date) => {
  return date.toISOString().split('T')[0]
}
</script> 