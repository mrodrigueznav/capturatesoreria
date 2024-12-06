<template>
    <button
      :type="type"
      :disabled="loading || disabled"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <span v-if="loading" class="spinner mr-2"></span>
      <span>{{ loading ? 'Loading...' : defaultSlot }}</span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    type: {
      type: String,
      default: 'button', // Default to 'button' to avoid accidental form submission
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  
  const defaultSlot = useSlots().default ? useSlots().default()[0]?.children : 'Submit';
  </script>
  
  <style scoped>
  .spinner {
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-right: 2px solid white;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  