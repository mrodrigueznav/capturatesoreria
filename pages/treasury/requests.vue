<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-white">Solicitudes de devolución (Tesorería)</h1>
    
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
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="movement in movements" :key="movement.id"
    @click="navigateToDetail(movement.id)"
    class="hover:bg-gray-700 cursor-pointer transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ `INT-${String(movement.id).padStart(3, '0')}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ `FOL-${new Date(movement.fechaCreacion).getFullYear()}-${String(movement.id).padStart(3, '0')}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatRazonSocial(movement.razonSocial) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatSucursal(movement.sucursal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ movement.deLaCuenta }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatBanco(movement.banco) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ movement.cuenta }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatCurrency(movement.importe) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const headers = [
  { key: 'folioInterno', label: 'Folio Interno' },
  { key: 'folio', label: 'Folio' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'sucursal', label: 'Sucursal' },
  { key: 'cuentaOrigen', label: 'Cuenta de Origen' },
  { key: 'banco', label: 'Banco' },
  { key: 'cuentaDestino', label: 'Cuenta Destino' },
  { key: 'importe', label: 'Importe' }
]

// Fetch movements from the API
const { data: movements } = await useFetch('/api/movimientos')

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

const navigateToDetail = (id) => {
  const targetRoute = `/treasury/mov/${id}`;
  console.log('Navigating to:', targetRoute);
  router.push(targetRoute).then(() => {
    console.log('Navigation successful');
  }).catch(err => {
    console.error('Navigation error:', err);
  });
};


</script>