<template>
  <header class="bg-gray-800 shadow">
    <nav class="px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <h2 class="text-xl font-semibold text-gray-100">Dashboard</h2>
      </div>
      <div class="flex gap-4">
        <button class="text-gray-300 hover:text-gray-100 relative">
          <span class="material-icons">notifications</span>
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>
        <button class="text-gray-300 hover:text-gray-100">
          <span class="material-icons">search</span>
        </button>
      </div>
    </nav>
  </header>
</template>