<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-white">Captura de Movimientos</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Form Fields -->
      <FormSection title="Información del Movimiento" icon="description">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            v-model="form.aFavor"
            label="A Favor"
            :options="beneficiaryOptions"
            required
          />
          <FormSelect
            v-model="form.sucursal"
            label="Sucursal"
            :options="branchOptions"
            required
          />
          <FormSelect
            v-model="form.centroCostos"
            label="Centro de Costos"
            :options="costCenterOptions"
            required
          />
          <FormSelect
            v-model="form.concepto"
            label="Concepto"
            :options="conceptOptions"
            required
          />
          <FormSelect
            v-model="form.tipo"
            label="Tipo"
            :options="typeOptions"
            required
          />
          <FormInput
            v-model="form.importe"
            label="Importe"
            type="number"
            step="0.01"
            required
          />
          <FormSelect
            v-model="form.banco"
            label="Banco"
            :options="bankOptions"
            required
          />
          <FormSelect
            v-model="form.deLaCuenta"
            label="De la Cuenta"
            :options="accountOptions"
            required
          />
          <FormInput
            v-model="form.cuenta"
            label="Cuenta"
            type="number"
            required
          />
          <FormSelect
            v-model="form.razonSocial"
            label="Razón Social"
            :options="companyOptions"
            required
          />
          <div class="md:col-span-2">
            <FormInput
              v-model="form.observaciones"
              label="Observaciones"
              type="text"
              class="h-24"
            />
          </div>
        </div>
      </FormSection>

      <!-- Form Actions -->
      <div class="flex justify-between space-x-4">
        <div class="space-x-4">
          <button
            type="button"
            @click="addAnexo"
            class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            <span class="material-icons mr-2 align-middle">attach_file</span>
            Anexo 1
          </button>
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            <span class="material-icons mr-2 align-middle">restart_alt</span>
            Reset
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <span class="material-icons mr-2 align-middle">save</span>
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const form = ref({
  aFavor: '',
  sucursal: '',
  centroCostos: '',
  concepto: '',
  tipo: '',
  importe: '',
  banco: '',
  deLaCuenta: '',
  cuenta: '',
  razonSocial: '',
  observaciones: ''
})

const beneficiaryOptions = [
  { value: 'emp1', label: 'Empleado 1' },
  { value: 'emp2', label: 'Empleado 2' },
  { value: 'prov1', label: 'Proveedor 1' }
]

const branchOptions = [
  { value: 'cdmx', label: 'Ciudad de México' },
  { value: 'gdl', label: 'Guadalajara' },
  { value: 'mty', label: 'Monterrey' }
]

const costCenterOptions = [
  { value: 'cc1', label: 'Centro de Costos 1' },
  { value: 'cc2', label: 'Centro de Costos 2' },
  { value: 'cc3', label: 'Centro de Costos 3' }
]

const conceptOptions = [
  { value: 'con1', label: 'Concepto 1' },
  { value: 'con2', label: 'Concepto 2' },
  { value: 'con3', label: 'Concepto 3' }
]

const typeOptions = [
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'egreso', label: 'Egreso' },
  { value: 'transferencia', label: 'Transferencia' }
]

const bankOptions = [
  { value: 'bbva', label: 'BBVA' },
  { value: 'santander', label: 'Santander' },
  { value: 'banamex', label: 'Banamex' }
]

const accountOptions = [
  { value: 'acc1', label: 'Cuenta 1' },
  { value: 'acc2', label: 'Cuenta 2' },
  { value: 'acc3', label: 'Cuenta 3' }
]

const companyOptions = [
  { value: 'comp1', label: 'Compañía 1' },
  { value: 'comp2', label: 'Compañía 2' },
  { value: 'comp3', label: 'Compañía 3' }
]

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
}

const addAnexo = () => {
  console.log('Adding anexo...')
  // TODO: Implement anexo functionality
}

const resetForm = () => {
  form.value = {
    aFavor: '',
    sucursal: '',
    centroCostos: '',
    concepto: '',
    tipo: '',
    importe: '',
    banco: '',
    deLaCuenta: '',
    cuenta: '',
    razonSocial: '',
    observaciones: ''
  }
}
</script>