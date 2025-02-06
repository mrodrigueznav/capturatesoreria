<template>
  <div class="p-6 border-2 border-orange-500">
    <h1 class="text-2xl font-bold mb-6 text-white">Alta en Banca Electrónica</h1>

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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody v-if="movements && movements.length" class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="movement in movements" :key="movement.id" class="hover:bg-gray-700 transition-colors">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <button @click="openValidationModal(movement)"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Alta Realizada
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="bg-gray-800">
            <tr>
              <td colspan="8" class="text-center text-sm text-gray-400 px-6 py-4">
                No hay movimientos disponibles.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold mb-4">Alta</h2>
        <p>¿Estás seguro de que deseas validar que esta alta ya fue realizada?</p>
        <div class="flex justify-end mt-4">
          <button @click="confirmValidation" class="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Confirmar
          </button>
          <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovements } from '../../composables/useMovements';

const router = useRouter();
const { fetchAllMovements, updateMovementStatus } = useMovements();

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
const showModal = ref(false);
const selectedMovement = ref(null);

const fetchMovements = async () => {
  const { data, error } = await fetchAllMovements();
  if (error) {
    console.error('Error fetching movements:', error);
    return;
  }
  movements.value = data.filter(movement => movement.WorkflowStatus === 1);
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

const openValidationModal = (movement) => {
  selectedMovement.value = movement;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedMovement.value = null;
};

const confirmValidation = async () => {
  try {
    const { success, error } = await updateMovementStatus(selectedMovement.value.id, 2);
    if (error) throw error;
    
    alert('Movimiento validado exitosamente.');
    movements.value = movements.value.filter(m => m.id !== selectedMovement.value.id);
  } catch (error) {
    console.error('Error al validar el movimiento:', error);
  } finally {
    closeModal();
  }
};

onMounted(() => {
  fetchMovements();
});
</script>