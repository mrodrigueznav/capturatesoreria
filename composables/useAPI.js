// composables/useApi.js
import { ref } from 'vue';

export function useApi(baseAPIURL = 'https://gsict.azurewebsites.net/api/v1') {
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
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function uploadFile(file, endpoint = '/files/upload') {
    loading.value = true;
    errorMessage.value = '';

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${baseAPIURL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading file');
      }

      return await response.json();
    } catch (error) {
      errorMessage.value = error.message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    errorMessage,
    fetchData,
    uploadFile,
  };
}