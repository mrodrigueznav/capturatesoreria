<template>
  <aside 
    class="bg-gray-800 min-h-[95vh] shadow-lg flex flex-col transition-all duration-300"
    :class="isExpanded ? 'w-full' : 'w-20'"
  >
    <!-- Toggle Button -->
    <button 
      @click="$emit('toggle')"
      class="absolute -right-3 top-4 bg-gray-700 rounded-full p-1 shadow-lg hover:bg-gray-600 transition-colors z-10"
    >
      <span class="material-icons text-gray-300" :class="{ 'rotate-180': !isExpanded }">
        chevron_left
      </span>
    </button>

    <!-- Navigation Links -->
    <nav class="flex-1 py-4">
      <ul class="space-y-2 px-2">
        <li v-for="item in navigationItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors rounded-lg"
            :class="{ 
              'bg-gray-700 text-gray-100': isCurrentPath(item.path),
              'justify-center': !isExpanded
            }"
          >
            <span class="material-icons text-xl" :class="{ 'mr-3': isExpanded }">{{ item.icon }}</span>
            <span v-show="isExpanded" class="whitespace-nowrap">{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center" :class="{ 'justify-center': !isExpanded }">
        <span class="material-icons text-gray-400">account_circle</span>
        <div v-show="isExpanded" class="ml-3">
          <p class="text-sm font-medium text-gray-300">Admin User</p>
          <p class="text-xs text-gray-500">admin@movwa.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle'])

const route = useRoute()

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Employee Form', path: '/employees/capture', icon: 'person_add' },
  { name: 'Analytics', path: '/analytics', icon: 'analytics' },
  { name: 'Users', path: '/users', icon: 'group' },
  { name: 'Settings', path: '/settings', icon: 'settings' }
]

const isCurrentPath = (path) => {
  return route.path === path
}
</script>