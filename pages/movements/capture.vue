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

			<!-- File Upload Button -->
			<div>
				<label class="block mb-2 text-white font-medium">Anexo</label>
				<button
					type="button"
					@click="selectFile"
					class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
				>
					<span class="material-icons mr-2 align-middle">attach_file</span>
					{{ selectedFile ? selectedFile.name : 'Seleccionar archivo' }}
				</button>
				<p v-if="fileError" class="text-red-500 text-sm">{{ fileError }}</p>
			</div>

			<!-- Form Actions -->
			<div class="flex justify-between space-x-4">
				<div class="space-x-4">
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
					:disabled="isSubmitDisabled"
					class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span class="material-icons mr-2 align-middle">save</span>
					Guardar
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});
import { ref, computed } from 'vue';

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
	observaciones: '',
	anexoUrl: '', // Stores the uploaded file URL
});

const selectedFile = ref(null);
const isUploading = ref(false);
const isSaving = ref(false);
const fileError = ref('');

const beneficiaryOptions = [{ value: 'emp1', label: 'Empleado 1' }];
const branchOptions = [{ value: 'cdmx', label: 'Ciudad de México' }];
const costCenterOptions = [{ value: 'cc1', label: 'Centro de Costos 1' }];
const conceptOptions = [{ value: 'con1', label: 'Concepto 1' }];
const typeOptions = [{ value: 'ingreso', label: 'Ingreso' }];
const bankOptions = [{ value: 'bbva', label: 'BBVA' }];
const accountOptions = [{ value: 'acc1', label: 'Cuenta 1' }];
const companyOptions = [{ value: 'comp1', label: 'Compañía 1' }];

const isSubmitDisabled = computed(() => {
	const requiredFieldsFilled = Object.keys(form.value)
		.filter((key) => key !== 'observaciones' && key !== 'anexoUrl')
		.every((key) => form.value[key] !== '');
	return !requiredFieldsFilled || isUploading.value || isSaving.value;
});

const selectFile = () => {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = '.pdf,.doc,.docx,.jpg,.png';
	fileInput.onchange = (event) => {
		selectedFile.value = event.target.files[0] || null;
		//enable the Guardar button
		if (selectedFile.value) {
			isSubmitDisabled.value = false;
		}
	};
	fileInput.click();
};

const handleSubmit = async () => {
	if (!selectedFile.value) {
		fileError.value = 'Debe seleccionar un archivo.';
		return;
	}

	try {
		isSaving.value = true;
		// Step 1: Upload File
		const formData = new FormData();
		formData.append('file', selectedFile.value);

		const uploadResponse = await fetch(
			'http://localhost:3001/api/v1/files/upload',
			{
				method: 'POST',
				body: formData,
			}
		);

		if (!uploadResponse.ok) {
			throw new Error('Error uploading file');
		}

		const uploadedFile = await uploadResponse.json(); // Assuming the response contains FileName and FileUrl

		form.value.file = {
			// movementId: route.params.id,
			FileName: uploadedFile.data.filename,
			FileUrl: uploadedFile.data.url,
			Status: 0,
			Stage: 2,
			CreatedBy: process.client ? localStorage.username : '999',
		};

		// Step 2: Save Form
		const saveResponse = await fetch('http://localhost:3001/api/v1/mov', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form.value),
		});

		if (!saveResponse.ok) {
			throw new Error('Error saving movimiento');
		}

		alert('Movimiento guardado exitosamente');
		resetForm();
	} catch (error) {
		console.error('Error:', error);
		alert('Error al guardar el movimiento');
	} finally {
		isSaving.value = false;
	}
};

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
		observaciones: '',
		anexoUrl: '',
	};
	selectedFile.value = null;
	fileError.value = '';
};
</script>
