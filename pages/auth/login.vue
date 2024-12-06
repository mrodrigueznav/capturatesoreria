<template>
	<div class="bg-gray-600 min-h-screen flex items-center justify-center">
		<div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
			<h2 class="text-2xl font-bold text-white mb-6 text-center">Ingresar</h2>

			<form @submit.prevent="handleSubmit" class="space-y-6">
				<FormInput
					v-model="formData.username"
					label="Username"
					type="text"
					required
					ref="usernameInput"
					:class="{ 'input-error': errorMessage && !formData.username }"
				/>

				<FormInput
					v-model="formData.password"
					label="Password"
					type="password"
					required
					:class="{ 'input-error': errorMessage && !formData.password }"
				/>

				<FormButton
					type="submit"
					:loading="loading"
					:disabled="loading || !formData.username || !formData.password"
				>
					Login
				</FormButton>

				<p v-if="errorMessage" class="text-red-500 text-sm text-center mt-4">
					{{ errorMessage }}
				</p>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { useApi } from '@/composables/useApi';
import { saveUserDetails } from '@/utils/storage';

definePageMeta({
	layout: 'login',
});

const config = useRuntimeConfig();
const baseAPIURL = config.public.API_BASE;
const { fetchData, loading, errorMessage } = useApi(baseAPIURL);
const router = useRouter();

const formData = ref({
	username: '',
	password: '',
});

const usernameInput = ref();

onMounted(() => {
	usernameInput.value.focus(); // Focus on the username input field on load
});

const handleSubmit = debounce(async () => {
	try {
		const data = await fetchData('/auth/login', {
			method: 'POST',
			body: JSON.stringify(formData.value),
		});

		// Save user details to local storage
		saveUserDetails(data);

		// Navigate to the dashboard
		router.push('/');
	} catch (error) {
		// Provide more user-friendly error messages
		if (error.message.includes('NetworkError')) {
			errorMessage.value = 'Network error, please try again.';
		} else if (error.message.includes('Login failed')) {
			errorMessage.value = 'Invalid username or password.';
		} else {
			errorMessage.value = 'An unexpected error occurred.';
		}
	}
}, 300); // 300ms debounce to prevent rapid form submissions
</script>

<style scoped>
.input-error {
	border-color: red;
}
</style>
