<template>
  <div class="p-6 border-2 border-orange-500">
    <h1 class="text-2xl font-bold mb-6 text-white">Captura de Transferencias</h1>
    
    <!-- Table -->
    <div class="bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900">
            <tr>
              <th v-for="header in headers" :key="header.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                {{ header.label }}
              </th>
            </tr>
          </thead>
          <tbody v-if="movements && movements.length" class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="movement in movements" :key="movement.id"
                @click="navigateToDetail(movement.id)"
                class="hover:bg-gray-700 cursor-pointer transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ `INT-${String(movement.id).padStart(3, '0')}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatRazonSocial(movement.Empresa) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatSucursal(movement.Sucursal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ movement.PasivoAutorizacion }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ movement.RazonSocialDeposito }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ movement.CuentaSapCliente }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ movement.RazonSocialDevolucion }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="bg-gray-800">
            <tr>
              <td colspan="7" class="text-center text-sm text-gray-400 px-6 py-4">
                No hay movimientos disponibles.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const headers = [
  { key: 'folioInterno', label: 'Folio Interno' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'sucursal', label: 'Sucursal' },
  { key: 'pasivoAutorizacion', label: 'Pasivo Autorización' },
  { key: 'razonSocialDeposito', label: 'Razón Social Depósito' },
  { key: 'cuentaSapCliente', label: 'Cuenta SAP Cliente' },
  { key: 'razonSocialDevolucion', label: 'Razón Social Devolución' }
];

const movements = ref([]);

const fetchMovements = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/v1/mov');
    const data = await response.json();

    // Filter movements to only include those with WorkflowStatus = 1
    movements.value = data.data.filter(movement => movement.WorkflowStatus === 3);
  } catch (error) {
    console.error('Error fetching movements:', error);
  }
};

const formatSucursal = (sucursal) => {
  const sucursales = {
    'cdmx': 'Ciudad de México',
    'gdl': 'Guadalajara',
    'mty': 'Monterrey'
  };
  return sucursales[sucursal] || sucursal;
};

const formatRazonSocial = (razonSocial) => {
  const companies = {
    'empresa1': 'Empresa 1',
    'empresa2': 'Empresa 2'
  };
  return companies[razonSocial] || razonSocial;
};

const navigateToDetail = (id) => {
  const targetRoute = `/treasury/mov/${id}`;
  router.push(targetRoute).then(() => {
    console.log('Navigation successful');
  }).catch(err => {
    console.error('Navigation error:', err);
  });
};

onMounted(() => {
  fetchMovements();
});
</script>

