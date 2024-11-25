<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Employee Data Capture</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Personal Information -->
      <FormSection title="Personal Information" icon="person">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            v-model="form.firstName"
            label="First Name"
            required
          />
          <FormInput
            v-model="form.lastName"
            label="Last Name"
            required
          />
          <FormInput
            v-model="form.email"
            label="Email"
            type="email"
            required
          />
          <FormInput
            v-model="form.phone"
            label="Phone Number"
            type="tel"
          />
          <FormInput
            v-model="form.dateOfBirth"
            label="Date of Birth"
            type="date"
            required
          />
          <FormSelect
            v-model="form.gender"
            label="Gender"
            :options="genderOptions"
            required
          />
        </div>
      </FormSection>

      <!-- Employment Details -->
      <FormSection title="Employment Details" icon="work">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            v-model="form.employeeId"
            label="Employee ID"
            required
          />
          <FormInput
            v-model="form.startDate"
            label="Start Date"
            type="date"
            required
          />
          <FormSelect
            v-model="form.department"
            label="Department"
            :options="departmentOptions"
            required
          />
          <FormSelect
            v-model="form.position"
            label="Position"
            :options="positionOptions"
            required
          />
          <FormInput
            v-model="form.salary"
            label="Salary"
            type="number"
            required
          />
          <FormSelect
            v-model="form.employmentType"
            label="Employment Type"
            :options="employmentTypeOptions"
            required
          />
        </div>
      </FormSection>

      <!-- Emergency Contact -->
      <FormSection title="Emergency Contact" icon="contact_phone">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            v-model="form.emergencyContact.name"
            label="Contact Name"
            required
          />
          <FormInput
            v-model="form.emergencyContact.phone"
            label="Contact Phone"
            type="tel"
            required
          />
          <FormInput
            v-model="form.emergencyContact.relationship"
            label="Relationship"
            required
          />
        </div>
      </FormSection>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save Employee Data
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  employeeId: '',
  startDate: '',
  department: '',
  position: '',
  salary: '',
  employmentType: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  }
})

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]

const departmentOptions = [
  { value: 'it', label: 'Information Technology' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' }
]

const positionOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'coordinator', label: 'Coordinator' }
]

const employmentTypeOptions = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' }
]

const handleSubmit = () => {
  // TODO: Implement form submission
  console.log('Form submitted:', form.value)
}

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    employeeId: '',
    startDate: '',
    department: '',
    position: '',
    salary: '',
    employmentType: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  }
}
</script>