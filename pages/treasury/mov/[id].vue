<template>
	<div class="p-6">
		<div class="flex items-center mb-6">
			<button
				@click="router.back()"
				class="text-gray-300 hover:text-white mr-4"
			>
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
				<h2 class="text-xl font-semibold text-white mb-4">
					Información del Movimiento
				</h2>
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-gray-400">Folio Interno:</span>
						<span class="text-white font-medium">{{
							`INT-${String(movement.id).padStart(3, '0')}`
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Folio:</span>
						<span class="text-white font-medium">{{
							`FOL-${new Date(movement.createdAt).getFullYear()}-${String(
								movement.id
							).padStart(3, '0')}`
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Empresa:</span>
						<span class="text-white font-medium">{{
							formatRazonSocial(movement.RazonSocial)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Sucursal:</span>
						<span class="text-white font-medium">{{
							formatSucursal(movement.Sucursal)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Cuenta de Origen:</span>
						<span class="text-white font-medium">{{
							movement.CuentaFrom
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Banco:</span>
						<span class="text-white font-medium">{{
							formatBanco(movement.Banco)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Cuenta Destino:</span>
						<span class="text-white font-medium">{{ movement.CuentaTo }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Importe:</span>
						<span class="text-white font-medium">{{
							formatCurrency(movement.Importe)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Fecha de Solicitud:</span>
						<span class="text-white font-medium">{{
							formatDate(movement.createdAt)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Observaciones:</span>
						<span class="text-white font-medium">{{
							movement.Observaciones || 'Sin observaciones'
						}}</span>
					</div>
				</div>
			</div>

			<!-- Files Section -->
			<div class="bg-gray-800 rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold text-white mb-4">
					Archivos Relacionados
				</h2>
				<div
					v-for="file in movement.Movement_files"
					:key="file.id"
					class="space-y-2"
				>
					<div class="flex justify-between items-center">
						<span class="text-gray-400">{{ file.FileName }}</span>
						<span class="text-gray-400">{{ file.CreatedBy }}</span>
						<span class="text-gray-400">{{ formatStage(file.Stage) }}</span>
						<a
							:href="file.FileUrl"
							target="_blank"
							class="text-blue-400 hover:underline"
							>Ver Archivo</a
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Upload Button -->
		<div class="mt-6">
			<label
				class="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700 transition-colors"
			>
				Anexar Archivo
				<input type="file" class="hidden" @change="uploadFile" />
			</label>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const validationStatus = ref('pending');

const {
	data: response,
	pending,
	error,
} = await useFetch(`http://localhost:3001/api/v1/mov/${route.params.id}`);

const movement = ref(response.value?.data || {});

const formatSucursal = (sucursal) => {
	const sucursales = {
		cdmx: 'Ciudad de México',
		gdl: 'Guadalajara',
		mty: 'Monterrey',
	};
	return sucursales[sucursal] || sucursal;
};

const formatStage = (stage) => {
	const stages = {
		1: 'Solicitud',
		2: 'Validación',
		3: 'Aprobación',
		4: 'Rechazo',
	};
	return stages[stage] || stage;
};

const formatBanco = (banco) => {
	const bancos = {
		bbva: 'BBVA',
		santander: 'Santander',
		banamex: 'Banamex',
	};
	return bancos[banco] || banco;
};

const formatRazonSocial = (razonSocial) => {
	const companies = {
		comp1: 'Compañía 1',
		comp2: 'Compañía 2',
		comp3: 'Compañía 3',
	};
	return companies[razonSocial] || razonSocial;
};

const formatCurrency = (amount) => {
	return new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'MXN',
	}).format(amount);
};

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString('es-MX', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const uploadFile = async (event) => {
	const file = event.target.files[0];
	if (file) {
		try {
			// Step 1: Upload the file
			const formData = new FormData();
			formData.append('file', file);

			const responseUpload = await fetch(
				'http://localhost:3001/api/v1/files/upload',
				{
					method: 'POST',
					body: formData,
				}
			);

			if (!responseUpload.ok) {
				throw new Error('Error uploading the file.');
			}

			const uploadedFile = await responseUpload.json(); // Assuming the response contains FileName and FileUrl
			console.log('File uploaded:', uploadedFile);

			// Step 2: Save file information to /files
			const createFileResponse = await fetch(
				'http://localhost:3001/api/v1/files',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						movementId: route.params.id,
						FileName: uploadedFile.data.filename,
						FileUrl: uploadedFile.data.url,
						Status: 0,
						Stage: 2,
						CreatedBy: process.client ? localStorage.username : '999',
						CuentaRetiro: uploadedFile.data.cuentaRetiro,
						ImporteOperacion: uploadedFile.data.importeOperacion,
						CuentaDeposito: uploadedFile.data.cuentaDeposito,
						FechaAplicacion: uploadedFile.data.fechaAplicacion
					}),
				}
			);

			if (!createFileResponse.ok) {
				throw new Error('Error saving file info.');
			}

			console.log('File info saved.');

			// Step 3: Update the movement status
			const updateMovementResponse = await fetch(
				`http://localhost:3001/api/v1/mov/status/${route.params.id}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						WorkflowStatus: 2, // Update WorkflowStatus
					}),
				}
			);

			if (!updateMovementResponse.ok) {
				throw new Error('Error updating movement status.');
			}

			console.log('Movement status updated.');

			// Redirect to treasury/requests
			router.push('/treasury/requests');
		} catch (error) {
			console.error('Error during file upload process:', error);
			alert('There was an issue processing the file upload.');
		}
	}
};
</script>
