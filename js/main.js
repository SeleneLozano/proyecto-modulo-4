/* =========================================
   1. IMPORTAR VALIDADORES, HELPERS Y FORMATEADORES
========================================= */
import { Usuario } from './models/Usuario.js';
import { Cuenta } from './models/Cuenta.js';
import { generarNumeroCuenta } from './utils/helpers.js';
import { validarCampoObligatorio } from './utils/validators.js';
import { STORAGE_KEYS, storageService } from './services/StorageService.js';
import { authService } from './services/AuthService.js';

/* =========================================
V6 INICIALIZAR STORAGE
========================================= */
function inicializarStorage() {
/* =====================================
RECUPERAR USUARIOS
===================================== */
const usuarios =
storageService.obtener(
STORAGE_KEYS.USUARIOS,
null,
);
/* =====================================
RECUPERAR CUENTAS
===================================== */
const cuentas =
storageService.obtener(
STORAGE_KEYS.CUENTAS,
null,
);
/* =====================================
RECUPERAR MOVIMIENTOS
===================================== */
const movimientos =
storageService.obtener(
STORAGE_KEYS.MOVIMIENTOS,
null,
);
/* =====================================
CREAR USUARIOS SI NO EXISTE
===================================== */
if (usuarios === null) {
storageService.guardar(
STORAGE_KEYS.USUARIOS,
[],
);
}
/* =====================================
CREAR CUENTAS SI NO EXISTE
===================================== */
if (cuentas === null) {
storageService.guardar(
STORAGE_KEYS.CUENTAS,
[],
);
}
/* =====================================
CREAR MOVIMIENTOS SI NO EXISTE
===================================== */
if (movimientos === null) {
storageService.guardar(
STORAGE_KEYS.MOVIMIENTOS,
[],
);
}
}

/* =========================================
MANEJAR REGISTRO
========================================= */
function manejarRegistro(event) {
/* =====================================
EVITAR ENVÍO TRADICIONAL
Impide que el formulario recargue automáticamente la página.
===================================== */
event.preventDefault();
/* =====================================
OBTENER NOMBRE
===================================== */
const nombre =
document
.querySelector(
'#registroNombre',
)
.value
.trim();
/* =====================================
OBTENER EMAIL
===================================== */
const email =
document
.querySelector(
'#registroEmail',
)
.value
.trim()
.toLowerCase();
/* =====================================
OBTENER TELÉFONO
===================================== */
const telefono =
document
.querySelector(
'#registroTelefono',
)
.value
.trim();
/* =====================================
OBTENER CONTRASEÑA
===================================== */
const password =
document
.querySelector(
'#registroPassword',
)
.value;
/* =====================================
CONFIRMAR CONTRASEÑA
===================================== */
const confirmarPassword =
document
.querySelector(
'#registroConfirmPassword',
)
.value;
/* =====================================
VALIDAR CAMPOS OBLIGATORIOS
===================================== */
if (
!validarCampoObligatorio(
nombre,
) ||
!validarCampoObligatorio(
email,
) ||
!validarCampoObligatorio(
password,
)
) {
/* Mostramos una alerta si faltan datos obligatorios. */
Swal.fire({
icon: 'warning',
title:
'Campos incompletos',
text:
'Completa los campos obligatorios.',
});
return;
}
/* =====================================
VALIDAR LONGITUD DE CONTRASEÑA
===================================== */
if (password.length < 6) {
  Swal.fire({
icon: 'warning',
title:
'Contraseña inválida',
text:
'La contraseña debe tener al menos 6 caracteres.',
});
return;
}
/* =====================================
COMPARAR CONTRASEÑAS
===================================== */
if (
password !==
confirmarPassword
) {
Swal.fire({
icon: 'warning',
title:
'Contraseñas diferentes',
text:
'Las contraseñas no coinciden.',
});
return;
}

/* =====================================
RECUPERAR USUARIOS
===================================== */
const usuarios =
storageService.obtener(
STORAGE_KEYS.USUARIOS,
[],
);
/* =====================================
BUSCAR CORREO DUPLICADO
some() responde: ¿Existe por lo menos un usuario con este mismo correo?
===================================== */
const emailExistente =
usuarios.some(
(usuario) =>
usuario.email
.toLowerCase() ===
email,
);
/* =====================================
DETENER REGISTRO DUPLICADO
===================================== */
if (emailExistente) {
Swal.fire({
icon: 'error',
title:
'Correo registrado',
text:
'Ya existe un usuario con este correo.',
});
return;
}

/* =====================================
CREAR INSTANCIA USUARIO
Utilizamos nuestro modelo Usuario creado desde versiones anteriores.
===================================== */
const nuevoUsuario =
new Usuario({
nombre,
email,
telefono,
password,
});
/* =====================================
NÚMERO DE CUENTA
===================================== */
let numeroCuenta;
/* =====================================
GENERAR NÚMERO ÚNICO
do...while garantiza que el proceso se ejecute al menos una vez.
===================================== */
do {
numeroCuenta =
generarNumeroCuenta();
} while (
/* Recuperamos todas las cuentas. */
storageService
.obtener(
STORAGE_KEYS.CUENTAS,
[],
)
/* Verificamos si alguna cuenta ya tiene ese número. */
.some(
(cuenta) =>
cuenta.numeroCuenta ===
numeroCuenta,
)
);

/* =====================================
CREAR CUENTA
Relacionamos la cuenta con el usuario registrado.
===================================== */
const nuevaCuenta =
new Cuenta({
numeroCuenta,
tipo: 'Ahorro',
saldo: 0,
usuarioId:
nuevoUsuario.id,
});

/* =====================================
RECUPERAR CUENTAS
===================================== */
const cuentas =
storageService.obtener(
STORAGE_KEYS.CUENTAS,
[],
);
/* =====================================
AGREGAR USUARIO
===================================== */
usuarios.push(
nuevoUsuario,
);
/* =====================================
AGREGAR CUENTA
===================================== */
cuentas.push(
nuevaCuenta,
);
/* =====================================
GUARDAR USUARIOS
===================================== */
storageService.guardar(
STORAGE_KEYS.USUARIOS,
usuarios,
);
/* =====================================
GUARDAR CUENTAS
===================================== */
storageService.guardar(
STORAGE_KEYS.CUENTAS,
cuentas,
);

/* =====================================
REGISTRO EXITOSO
===================================== */
Swal.fire({
icon: 'success',
title:
'Registro exitoso',
text:
'Tu usuario y cuenta bancaria fueron creados correctamente.',
confirmButtonText:
'Continuar',
}).then(() => {
/* =================================
LIMPIAR FORMULARIO
================================= */
document
.querySelector(
'#formRegistro',
)
.reset();
/* =================================
COPIAR CORREO AL LOGIN
================================= */
document
.querySelector(
'#loginEmail',
)
.value = email;
});
}

/* =========================================
V6 MANEJAR LOGIN
========================================= */
function manejarLogin(event) {
/* =====================================
EVITAR ENVÍO AUTOMÁTICO
===================================== */
event.preventDefault();
/* =====================================
OBTENER EMAIL
===================================== */
const email =
document
.querySelector(
'#loginEmail',
)
.value
.trim()
.toLowerCase();
/* =====================================
OBTENER CONTRASEÑA
===================================== */
const password =
document
.querySelector(
'#loginPassword',
)
.value;
/* =====================================
VALIDAR CAMPOS
===================================== */
if (
!validarCampoObligatorio(
email,
) ||
!validarCampoObligatorio(
password,
)
) {
Swal.fire({
icon: 'warning',
title:
'Campos incompletos',
text:
'Ingresa tu correo y contraseña.',
});
return;
}
/* =====================================
INTENTAR LOGIN
===================================== */
try {
/* =================================
AUTENTICAR USUARIO
================================= */
const usuario =
authService.login(
email,
password,
);
/* =================================
LOGIN EXITOSO
================================= */
Swal.fire({
icon: 'success',
title:
`Bienvenido, ${usuario.nombre}`,
text:
'Inicio de sesión correcto.',
timer: 1500,
showConfirmButton:
false,
}).then(() => {
/* =============================
REDIRIGIR AL DASHBOARD
============================= */
window.location.href =
'dashboard.html';
});
} catch (error) {
/* =====================================
LOGIN INCORRECTO
===================================== */
Swal.fire({
icon: 'error',
title:
'No fue posible iniciar sesión',
text:
error.message,
});
}
}

/* =========================================
V6 INICIALIZAR APLICACIÓN
========================================= */
function init() {
/* =====================================
PREPARAR LOCALSTORAGE
===================================== */
inicializarStorage();
/* =====================================
COMPROBAR SESIÓN
Si ya existe un usuario autenticado, lo enviamos directamente al
dashboard.
===================================== */
if (
authService
.getCurrentUser()
) {
window.location.href =
'dashboard.html';
return;
}
/* =====================================
OBTENER LOGIN
===================================== */
const formLogin =
document.querySelector(
'#formLogin',
);
/* =====================================
OBTENER REGISTRO
===================================== */
const formRegistro =
document.querySelector(
'#formRegistro',
);
/* =====================================
EVENTO LOGIN
Cuando ocurra submit, ejecutar manejarLogin().
===================================== */
if (formLogin) {
formLogin.addEventListener(
'submit',
manejarLogin,
);
}
/* =====================================
EVENTO REGISTRO
Cuando ocurra submit, ejecutar manejarRegistro().
===================================== */
if (formRegistro) {
formRegistro.addEventListener(
'submit',
manejarRegistro,
);
}
}
/* =========================================
EJECUTAR INICIALIZACIÓN
========================================= */
init();

/* =========================================
   3. FUNCIONES DE PERSISTENCIA
========================================= */

// Guardar el estado completo del banco
function guardarBanco(banco) {
  storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
  storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
  storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
}


