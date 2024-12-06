// utils/storage.js
export function saveUserDetails({ token, user }) {
	localStorage.setItem('token', token);
	localStorage.setItem('username', user.username);
	localStorage.setItem('nombre', user.nombre);
	localStorage.setItem('empresa', user.empresa);
	localStorage.setItem('pAppV', user.permisos);
}
