<template>
  <nav class="bg-gray-800 shadow-lg sticky top-0 z-50 h-full">
    <div class="px-4 h-full flex items-center justify-between">
      <!-- App Name -->
      <div class="flex items-center">
        <span class="material-icons text-blue-500 mr-2">work</span>
        <h1 class="text-xl font-bold text-gray-100">movWA</h1>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-4">
        <button class="text-gray-300 hover:text-gray-100">
          <span class="material-icons">notifications</span>
        </button>
        <button class="text-gray-300 hover:text-gray-100">
          <span class="material-icons">settings</span>
        </button>
        <div class="flex items-center">
          <span class="material-icons text-gray-300">account_circle</span>
          <span class="ml-2 text-sm text-gray-300">Admin</span>
        </div>
      </div>
    </div>
  </nav>
</template>