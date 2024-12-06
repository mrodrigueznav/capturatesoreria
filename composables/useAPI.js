// composables/useApi.js
import { ref } from 'vue';

export function useApi(baseAPIURL) {
	const loading = ref(false);
	const errorMessage = ref('');

	async function fetchData(endpoint, options = {}) {
		loading.value = true;
		errorMessage.value = '';

		try {
			const response = await fetch(`${baseAPIURL}${endpoint}`, {
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

			return await response.json();
		} catch (error) {
			errorMessage.value = error.message;
			throw error; // Re-throw for handling in calling functions
		} finally {
			loading.value = false;
		}
	}

	return {
		loading,
		errorMessage,
		fetchData,
	};
}
