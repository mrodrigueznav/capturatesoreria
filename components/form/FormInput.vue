<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-100"
      :required="required"
      ref="inputElement"
    >
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const id = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`);

// Reference for the input element
const inputElement = ref(null);

// Expose the `focus` method
defineExpose({
  focus: () => inputElement.value?.focus(),
});

defineEmits(['update:modelValue']);
</script>
