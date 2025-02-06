<template>
	<div class="p-6 max-w-4xl mx-auto border-2 border-green-500">
		<h1 class="text-2xl font-bold mb-6 text-white">Solicitud de Devolución</h1>

		<form @submit.prevent="handleSubmit" class="space-y-6">
			<FormSection title="Información del Movimiento" icon="description">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormSelect v-model="form.empresa" label="Empresa" :options="companyOptions" required />
					<FormSelect v-model="form.sucursal" label="Sucursal" :options="branchOptions" required />
					<FormInput v-model="form.pasivoAutorizacion" label="Pasivo de Autorización" type="text" required />
					<FormSelect v-model="form.concepto" label="Concepto" :options="conceptOptions" required />
				</div>
			</FormSection>

			<FormSection title="Datos Deposito Cliente" icon="account_balance">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormInput v-model="form.razonSocialDeposito" label="Razón Social" type="text" required />
					<FormInput v-model="form.importeDeposito" label="Importe" type="number" step="0.01" required />
					<FormInput v-model="form.cuentaSapCliente" label="Cuenta SAP Cliente" type="text" />
					<FormSelect v-model="form.bancoDeposito" label="Banco" :options="allAvailableBanks" required />
					<FormInput v-model="form.cuentaDeposito" label="Cuenta" type="text" required />
					<FormInput v-model="form.referenciaDeposito" label="Referencia" type="text" required />
				</div>
			</FormSection>

			<FormSection title="Datos para Devolución" icon="account_balance_wallet">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormInput v-model="form.importeDevolucion" label="Importe" type="number" step="0.01" required />
					<FormSelect v-model="form.bancoOrigen" label="Banco Origen" :options="bankOptions" required />
					<FormSelect v-model="form.cuentaOrigen" label="Cuenta Origen" :options="accountOptions" required />
					<FormSelect v-model="form.bancoDestino" label="Banco Destino" :options="allAvailableBanks" required />
					<FormInput v-model="form.cuentaDestino" label="Cuenta Destino" type="text" required />
					<FormInput v-model="form.razonSocialDevolucion" label="Razón Social" type="text" required />
					<div class="md:col-span-2">
						<FormInput v-model="form.observaciones" label="Observaciones" type="text" class="h-24" />
					</div>
				</div>
			</FormSection>

			<!-- Form Actions -->
			<div class="flex justify-between space-x-4">
				<button type="button" @click="handleSoporteDeposito" class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
					Soporte Deposito
				</button>
				<button type="submit" :disabled="isSubmitDisabled" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
					Guardar
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '../../composables/useApi';

const { fetchData, uploadFile: uploadApiFile, loading, errorMessage } = useApi();

// Form State
const form = ref({
	empresa: '',
	sucursal: '',
	pasivoAutorizacion: '',
	concepto: '',
	razonSocialDeposito: '',
	importeDeposito: '',
	cuentaSapCliente: '',
	bancoDeposito: '',
	cuentaDeposito: '',
	referenciaDeposito: '',
	tipoDevolucion: 'Transferencia',
	importeDevolucion: '',
	bancoOrigen: '',
	cuentaOrigen: '',
	bancoDestino: '',
	cuentaDestino: '',
	razonSocialDevolucion: '',
	observaciones: '',
	anexoUrl: '',
});

// Correctly initialized dropdown options with mock data
const allAccounts = ref([]);
const allBanks = ref([]);
const branchOptions = ref([]);
const bankOptions = ref([]);
const accountOptions = ref([]);

const allAvailableBanks = ref([
  { value: "bbva", label: "BBVA México" },
  { value: "banorte", label: "Banorte" },
  { value: "santander", label: "Santander México" },
  { value: "citibanamex", label: "Citibanamex" },
  { value: "banobras", label: "Banobras" },
  { value: "hsbc", label: "HSBC México" },
  { value: "scotiabankInverlat", label: "Scotiabank Inverlat" },
  { value: "inbursa", label: "Inbursa" },
  { value: "nacionalFinancieraNafin", label: "Nacional Financiera (Nafin)" },
  { value: "bancomext", label: "Bancomext" },
  { value: "banbajio", label: "BanBajío" },
  { value: "bancoAzteca", label: "Banco Azteca" },
  { value: "afirme", label: "Afirme" },
  { value: "monex", label: "Monex" },
  { value: "banregio", label: "Banregio" },
  { value: "bancaMifel", label: "Banca Mifel" },
  { value: "ciBanco", label: "CI Banco" },
  { value: "intercamBanco", label: "Intercam Banco" },
  { value: "abcCapital", label: "ABC Capital" },
  { value: "bancoBase", label: "Banco BASE" }
]);

const companyOptions = ref([
	{ value: 'cosein', label: 'COSEIN' },
	{ value: 'cometra', label: 'COMETRA' },
	{ value: 'sesein', label: 'SESEIN' },
	{ value: 'sesepro', label: 'SESEPRO' },
	{ value: 'seguritec', label: 'SEGURITEC' },
	{ value: 'tecnopro', label: 'TECNOPRO' },
	{ value: 'grumer', label: 'GRUMER' },
	{ value: 'regio', label: 'REGIO' },
	{ value: 'tameme', label: 'TAMEME' },
	{ value: 'tyr', label: 'TYR' },
]);

const conceptOptions = ref([
	{ value: 'pago', label: 'Concepto1' },
	{ value: 'reembolso', label: 'Concepto2' },
]);

// File Upload State
const selectedFile = ref(null);
const fileError = ref('');
const isSaving = ref(false);

// Computed Property for Submit Button State
const isSubmitDisabled = computed(() => {
	const requiredFieldsFilled = Object.keys(form.value)
		.filter((key) => key !== 'observaciones' && key !== 'anexoUrl')
		.every((key) => form.value[key] !== '');
	return !requiredFieldsFilled || loading.value || isSaving.value;
});

// Fetch Options from Backend
const fetchDropdownOptions = async (empresa) => {
	try {
		const data = await fetchData(`/cc/empresa/${empresa}`);

		// Populate dropdown options
		branchOptions.value = [...new Set(data.data.map((item) => item.Sucursal))].map((sucursal) => ({
			value: sucursal,
			label: sucursal,
		}));

		allBanks.value = data.data.map((item) => ({
			value: item.Banco,
			label: item.Banco,
			Sucursal: item.Sucursal,
		}));

		allAccounts.value = data.data.map((item) => ({
			value: item.Clabe,
			label: `${item.Clabe} (${item.Sucursal}, ${item.Banco})`,
			Banco: item.Banco,
			Sucursal: item.Sucursal,
		}));
	} catch (error) {
		console.error('Error fetching data:', errorMessage.value);
	}
};

// Watch for Empresa Changes and Fetch Dropdown Options
watch(
	() => form.value.empresa,
	(newEmpresa) => {
		if (newEmpresa) {
			fetchDropdownOptions(newEmpresa);
		}
	}
);

// Watch for Sucursal Changes and Filter Banco
watch(
	() => form.value.sucursal,
	(newSucursal) => {
		if (newSucursal) {
			bankOptions.value = allBanks.value.filter(
				(bank) => bank.Sucursal === newSucursal
			);
			form.value.bancoDeposito = '';  // Reset Banco when Sucursal changes
		} else {
			bankOptions.value = [];
		}
	}
);

// Watch for Banco Changes and Filter DeLaCuenta
watch(
	() => form.value.bancoOrigen,
	(newBanco) => {
		if (newBanco) {
			accountOptions.value = allAccounts.value.filter(
				(account) =>
					account.Banco === newBanco && account.Sucursal === form.value.sucursal
			);
			form.value.cuentaDeposito = '';  // Reset DeLaCuenta when Banco changes
		} else {
			accountOptions.value = [];
		}
	}
);

// Submit Logic
const handleSubmit = async () => {
	if (!selectedFile.value) {
		fileError.value = 'Debe seleccionar un archivo.';
		return;
	}

	try {
		isSaving.value = true;

		// Upload File
		const uploadResponse = await uploadApiFile(selectedFile.value);
		const uploadedFile = uploadResponse.data;

		form.value.file = {
			FileName: uploadedFile.filename,
			FileUrl: uploadedFile.url,
			bankType: uploadedFile.bankType,
			cuentaCargo: uploadedFile.cuentaCargo,
			cuentaAbono: uploadedFile.cuentaAbono,
			importeOperacion: uploadedFile.importeOperacion,
			fechaAplicacion: uploadedFile.fechaAplicacion,
			Status: 0,
			Stage: 2,
			CreatedBy: process.client ? localStorage.username : '999',
		};

		// Save Form
		await fetchData('mov', {
			method: 'POST',
			body: JSON.stringify(form.value),
		});

		alert('Movimiento guardado exitosamente');
		resetForm();
	} catch (error) {
		alert('Error al guardar el movimiento: ' + errorMessage.value);
	} finally {
		isSaving.value = false;
	}
};

// Reset Form Logic
const resetForm = () => {
	form.value = {
		empresa: '',
		sucursal: '',
		pasivoAutorizacion: '',
		concepto: '',
		razonSocialDeposito: '',
		importeDeposito: '',
		cuentaSapCliente: '',
		bancoDeposito: '',
		cuentaDeposito: '',
		referenciaDeposito: '',
		tipoDevolucion: 'Transferencia',
		importeDevolucion: '',
		bancoOrigen: '',
		cuentaOrigen: '',
		bancoDestino: '',
		cuentaDestino: '',
		razonSocialDevolucion: '',
		observaciones: '',
		anexoUrl: '',
	};
	selectedFile.value = null;
	fileError.value = '';
};

// Handle Soporte Deposito
const handleSoporteDeposito = () => {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = '.pdf';
	fileInput.onchange = (event) => {
		selectedFile.value = event.target.files[0] || null;
	};
	fileInput.click();
};

// Fetch Data on Page Load
onMounted(() => {
	if (form.value.empresa) {
		fetchDropdownOptions(form.value.empresa);
	}
});
</script>