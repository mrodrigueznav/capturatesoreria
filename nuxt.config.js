export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      API_BASE: process.env.API_BASE || 'http://localhost:3001/api/v1', // Replace with your default
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Icons'
        }
      ]
    }
  },

  compatibilityDate: '2024-11-28'
})