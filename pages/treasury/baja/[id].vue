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
					<!-- Datos de Solicitud -->
					<h3 class="text-lg font-semibold text-white mb-2">Datos de Solicitud</h3>
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
							formatRazonSocial(movement.Empresa)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Sucursal:</span>
						<span class="text-white font-medium">{{
							formatSucursal(movement.Sucursal)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Pasivo de Autorización:</span>
						<span class="text-white font-medium">{{
							movement.PasivoAutorizacion
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Concepto:</span>
						<span class="text-white font-medium">{{
							formatConcepto(movement.Concepto)
						}}</span>
					</div>

					<!-- Datos Deposito Cliente -->
					<h3 class="text-lg font-semibold text-white mt-6 mb-2">Datos Deposito Cliente</h3>
					<div class="flex justify-between">
						<span class="text-gray-400">Razón Social Depósito:</span>
						<span class="text-white font-medium">{{
							movement.RazonSocialDeposito
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Importe Depósito:</span>
						<span class="text-white font-medium">{{
							formatCurrency(movement.ImporteDeposito)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Cuenta SAP Cliente:</span>
						<span class="text-white font-medium">{{
							movement.CuentaSapCliente
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Banco Depósito:</span>
						<span class="text-white font-medium">{{
							formatBanco(movement.BancoDeposito)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Cuenta Depósito:</span>
						<span class="text-white font-medium">{{
							movement.CuentaDeposito
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Referencia Depósito:</span>
						<span class="text-white font-medium">{{
							movement.ReferenciaDeposito
						}}</span>
					</div>

					<!-- Datos para Devolución -->
					<h3 class="text-lg font-semibold text-white mt-6 mb-2">Datos para Devolución</h3>
					<div class="flex justify-between">
						<span class="text-gray-400">Tipo Devolución:</span>
						<span class="text-white font-medium">{{
							formatTipoDevolucion(movement.TipoDevolucion)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Importe Devolución:</span>
						<span class="text-white font-medium">{{
							formatCurrency(movement.ImporteDevolucion)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Banco Origen:</span>
						<span class="text-white font-medium">{{
							formatBanco(movement.BancoOrigen)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Cuenta Origen:</span>
						<span class="text-white font-medium">{{
							movement.CuentaOrigen
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Banco Destino:</span>
						<span class="text-white font-medium">{{
							formatBanco(movement.BancoDestino)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Cuenta Destino:</span>
						<span class="text-white font-medium">{{
							movement.CuentaDestino
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Razón Social Devolución:</span>
						<span class="text-white font-medium">{{
							movement.RazonSocialDevolucion
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Observaciones:</span>
						<span class="text-white font-medium">{{
							movement.Observaciones || 'Sin observaciones'
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Fecha de Solicitud:</span>
						<span class="text-white font-medium">{{
							formatDate(movement.createdAt)
						}}</span>
					</div>
				</div>
			</div>

			<!-- Files Section -->
			<!-- <div class="bg-gray-800 rounded-lg shadow p-6">
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
			</div> -->
		</div>

		<!-- Additional Upload Button -->
		<div class="mt-6">
			<label
				class="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700 transition-colors"
			>
				Anexar Comprobante de Baja de Cuenta
				<input type="file" class="hidden" @change="handleFileUpload" />
			</label>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMovements } from '../composables/useMovements';

const { fetchMovement, uploadFile, updateMovementStatus } = useMovements();
const router = useRouter();
const route = useRoute();

const { data: response, pending, error } = await fetchMovement(route.params.id);
const movement = ref(response || {});

const formatSucursal = (sucursal) => {
	const sucursales = {
		MEXICO: 'México',
		GUADALAJARA: 'Guadalajara',
		MONTERREY: 'Monterrey',
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
		BBVA: 'BBVA',
		SANTANDER: 'Santander',
		BANAMEX: 'Banamex',
	};
	return bancos[banco] || banco;
};

const formatRazonSocial = (razonSocial) => {
	const companies = {
		empresa1: 'Empresa 1',
		empresa2: 'Empresa 2',
	};
	return companies[razonSocial] || razonSocial;
};

const formatConcepto = (concepto) => {
	const conceptos = {
		pago: 'Pago',
		reembolso: 'Reembolso',
	};
	return conceptos[concepto] || concepto;
};

const formatTipoDevolucion = (tipo) => {
	const tipos = {
		ingreso: 'Ingreso',
		egreso: 'Egreso',
	};
	return tipos[tipo] || tipo;
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

const handleFileUpload = async (event) => {
	const file = event.target.files[0];
	if (!file) return;

	try {
		const { data: uploadedFile, error } = await uploadFile(file, route.params.id);
		if (error) throw error;
		console.log(uploadedFile)
		if (uploadedFile.importeOperacion !== movement.value.ImporteDevolucion) {
			const createClarification = await fetch('http://localhost:3001/api/v1/cfs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					movementId: route.params.id,
					FileName: uploadedFile.filename,
					FileUrl: uploadedFile.url,
					BankType: uploadedFile.bankType,
					CuentaAbono: uploadedFile.cuentaAbono,
					CuentaCargo: uploadedFile.cuentaCargo,
					ImporteOperacion: uploadedFile.importeOperacion,
					FechaAplicacion: uploadedFile.fechaAplicacion,
					Status: 0,
					Stage: 3,
					CreatedBy: process.client ? localStorage.username : '999',
				}),
			});
			throw new Error(`El importe de la operación no coincide con el importe del depósito. ${uploadedFile.importeOperacion} !== ${movement.value.ImporteDevolucion}`);
		}

		const { success, error: statusError } = await updateMovementStatus(route.params.id, 2);
		if (statusError) throw statusError;

		router.push('/treasury/transferCapture');
	} catch (error) {
		console.error('Error during file upload process:', error);
		alert('There was an issue processing the file upload.');
	}
};
</script>
