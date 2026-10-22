/* =========================================
IMPORTAR AUTH SERVICE
========================================= */
import {
authService,
} from '../services/AuthService.js';
/* =========================================
MOSTRAR USUARIO
========================================= */
function mostrarUsuario() {
/* =====================================
OBTENER USUARIO
===================================== */
const usuario =
authService.getCurrentUser();
/* =====================================
VALIDAR USUARIO
===================================== */
if (!usuario) {
return;
}
/* =====================================
OBTENER ELEMENTO DEL DOM
===================================== */
const nombreUsuario =
document.querySelector(
'#nombreUsuario',
);
/* =====================================
MOSTRAR NOMBRE
===================================== */
if (nombreUsuario) {
nombreUsuario.textContent =
`Sesión iniciada como ${usuario.nombre}`;
}
}

/* =========================================
INICIALIZAR LOGOUT
========================================= */
function inicializarLogout() {
/* =====================================
OBTENER BOTÓN
===================================== */
const logoutBtn =
document.querySelector(
'#logoutBtn',
);
/* =====================================
VALIDAR BOTÓN
===================================== */
if (!logoutBtn) {
return;
}
/* =====================================
EVENTO CLICK
===================================== */
logoutBtn.addEventListener(
'click',
() => {
/* =================================
CONFIRMAR SALIDA
================================= */
Swal.fire({
icon: 'question',
title:
'Cerrar sesión',
text:
'¿Seguro que deseas salir?',
showCancelButton:
true,
confirmButtonText:
'Sí, salir',
cancelButtonText:
'Cancelar',
}).then((result) => {
/* =================================
CANCELAR
================================= */
if (!result.isConfirmed) {
return;
}
/* =================================
CERRAR SESIÓN
================================= */
authService.logout();
/* =================================
VOLVER AL LOGIN
================================= */
window.location.href =
'index.html';
});
},
);
}

/* =========================================
INICIALIZAR DASHBOARD
========================================= */
function init() {
/* =====================================
PROTEGER RUTA
===================================== */
const accesoPermitido =
authService.protegerRuta();
/* =====================================
DETENER SIN ACCESO
===================================== */
if (!accesoPermitido) {
return;
}
/* =====================================
MOSTRAR USUARIO
===================================== */
mostrarUsuario();
/* =====================================
ACTIVAR LOGOUT
===================================== */
inicializarLogout();
}
/* =========================================
EJECUTAR
========================================= */
init();