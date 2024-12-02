export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'
  ],
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