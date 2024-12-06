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
				/>

				<FormInput
					v-model="formData.password"
					label="Password"
					type="password"
					required
				/>

				<FormButton type="submit" :loading="loading" :disabled="loading">
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
import { ref } from 'vue';
definePageMeta({
    layout: 'login'
});

const { $locally } = useNuxtApp()

const formData = ref({
  username: '',
  password: '',
});

const loading = ref(false);
const errorMessage = ref('');

async function handleSubmit() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();

    // Assuming the response includes a token
    const token = data.token;
    const username = data.user.username;
    const nombre = data.user.nombre;
    const empresa = data.user.empresa;
    const rol = data.user.permisos;

    // Save the token in localStorage or cookie
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('empresa', empresa);
    localStorage.setItem('pAppV', rol);
    // $locally.set('token', token);

    // Redirect or perform additional actions
    // For example: navigate to a dashboard
    window.location.href = '/';

  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>
