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
			const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
				headers: {
					'Content-Type': 'application/json',
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

	const updateMovementStatus = (id, status) => {
		return fetchData(`mov/status/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ WorkflowStatus: status })
		});
	};

	const getClarifications = () => {
		return fetchData('cfs');
	};

	return {
		loading,
		errorMessage,
		fetchData,
		getMovements,
		updateMovementStatus,
		getClarifications
	};
}
