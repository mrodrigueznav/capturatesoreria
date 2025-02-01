// composables/useApi.js
import { ref } from 'vue';

const BASE_API_URL = 'http://localhost:3001/api/v1';

export function useApi() {
	const loading = ref(false);
	const errorMessage = ref('');

	async function fetchData(endpoint, options = {}) {
		loading.value = true;
		errorMessage.value = '';

		try {
			// Get token from localStorage for authenticated requests
			const token = localStorage.getItem('token');
			
			const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
				headers: {
					'Content-Type': 'application/json',
					...(token && { 'Authorization': `Bearer ${token}` }),
					...options.headers,
				},
				...options,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Request failed');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			errorMessage.value = error.message;
			throw error;
		} finally {
			loading.value = false;
		}
	}

	// Common API methods
	const getMovements = (status) => {
		return fetchData('mov').then(response => {
			if (status !== undefined) {
				return {
					...response,
					data: response.data.filter(movement => movement.WorkflowStatus === status)
				};
			}
			return response;
		});
	};

	const getMovementById = (id) => {
		return fetchData(`mov/${id}`);
	};

	const updateMovementStatus = (id, status) => {
		return fetchData(`mov/status/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ WorkflowStatus: status })
		});
	};

	const uploadFile = async (file, movementId) => {
		const formData = new FormData();
		formData.append('file', file);
		
		// First upload the file
		const uploadedFile = await fetch(`${BASE_API_URL}/files/upload`, {
			method: 'POST',
			body: formData
		}).then(res => res.json());

		// Then save the file info
		return fetchData('files', {
			method: 'POST',
			body: JSON.stringify({
				movementId,
				FileName: uploadedFile.data.filename,
				FileUrl: uploadedFile.data.url,
				bankType: uploadedFile.data.bankType,
				cuentaAbono: uploadedFile.data.cuentaAbono,
				cuentaCargo: uploadedFile.data.cuentaCargo,
				importeOperacion: uploadedFile.data.importeOperacion,
				fechaAplicacion: uploadedFile.data.fechaAplicacion,
				Status: 0,
				Stage: 3,
				CreatedBy: process.client ? localStorage.username : '999'
			})
		});
	};

	const getClarifications = () => {
		return fetchData('cfs');
	};

	return {
		loading,
		errorMessage,
		getMovements,
		getMovementById,
		updateMovementStatus,
		uploadFile,
		getClarifications
	};
}
