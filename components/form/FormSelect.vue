<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-100"
      :required="required"
    >
      <option value="">Select {{ label }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="text-gray-100"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
})

const id = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

defineEmits(['update:modelValue'])
</script>