/* =========================================
V.6 IMPORTAR STORAGE SERVICE
AuthService necesita consultar los usuarios registrados y manejar la sesión
almacenada en LocalStorage.
========================================= */
import {
STORAGE_KEYS,
storageService,
} from './StorageService.js';

/* =========================================
V.6 SERVICIO DE AUTENTICACIÓN
========================================= */
class AuthService {
/* =========================================
INICIAR SESIÓN
Recuperamos todos los usuarios registrados. Si todavía no existe ninguno,
utilizamos un array vacío.
========================================= */
login(email, password) {
const usuarios =
storageService.obtener(
STORAGE_KEYS.USUARIOS,
[],
);
/* =====================================
NORMALIZAR CORREO
Convertimos el valor a String, eliminamos espacios y transformamos el
correo a minúsculas.
===================================== */
const emailNormalizado =
String(email)
.trim()
.toLowerCase();
/* =====================================
BUSCAR USUARIO
find() devuelve el primer usuario que cumpla todas estas condiciones:
- mismo correo - misma contraseña - usuario activo
===================================== */
const usuario =
usuarios.find(
(u) =>
u.email.toLowerCase() ===
emailNormalizado &&
u.password === password &&
u.activo !== false,
);
/* =====================================
CREDENCIALES INCORRECTAS
Si find() no encontró usuario, lanzamos un Error.
===================================== */
if (!usuario) {
throw new Error(
'Correo o contraseña incorrectos.',
);
}
/* =====================================
CREAR SESIÓN
La sesión solamente necesita saber:
- qué usuario inició sesión - cuándo inició sesión
===================================== */
const sesion = {
usuarioId: usuario.id,
fechaInicio:
new Date().toISOString(),
};
/* =====================================
GUARDAR SESIÓN
===================================== */
storageService.guardar(
STORAGE_KEYS.SESION,
sesion,
);
/* =====================================
DEVOLVER USUARIO
===================================== */
return usuario;
}

/* =========================================
V.6 CERRAR SESIÓN
Solamente eliminamos la clave SESION.
========================================= */
logout() {
storageService.eliminar(
STORAGE_KEYS.SESION,
);
}

/* =========================================
V.6 OBTENER USUARIO ACTUAL
========================================= */
getCurrentUser() {
/* =====================================
RECUPERAR SESIÓN
Si no existe una sesión, obtenemos null
===================================== */
const sesion =
storageService.obtener(
STORAGE_KEYS.SESION,
null,
);
/* =====================================
VALIDAR SESIÓN
===================================== */
if (!sesion) {
return null;
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
BUSCAR USUARIO DE LA SESIÓN
Relacionamos: sesion.usuarioId con: usuario.id
===================================== */
return (
usuarios.find(
(usuario) =>
usuario.id ===
sesion.usuarioId,
) || null
);
}

/* =========================================
PROTEGER RUTA
========================================= */
protegerRuta() {
/* =====================================
OBTENER USUARIO AUTENTICADO
===================================== */
const usuario =
this.getCurrentUser();
/* Si no existe usuario autenticado, regresamos a index.html. */
if (!usuario) {
window.location.href =
'index.html';
return false;
}
/* =====================================
ACCESO PERMITIDO
===================================== */
return true;
}
}
/* =========================================
EXPORTAR AUTH SERVICE
========================================= */
export const authService =
new AuthService();