export default defineNuxtRouteMiddleware((to, from) => {
    // Ensure localStorage is only accessed on the client
    if (process.client) {
      const token = localStorage.getItem('token');
  
      // If the token doesn't exist and the user is not on the login page, redirect to login
      if (!token && to.path !== '/auth/login') {
        return navigateTo('/auth/login');
      }
  
      // If the user is logged in and tries to access the login page, redirect to the dashboard
      if (token && to.path === '/auth/login') {
        return navigateTo('/');
      }
    }
  });
  