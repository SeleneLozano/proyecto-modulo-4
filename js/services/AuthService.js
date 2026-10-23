/* =========================================
   AUTH SERVICE
========================================= */

/* Importamos la configuración y la instancia singleton del servicio de almacenamiento */
import { STORAGE_KEYS, storageService } from './StorageService.js';

/* =========================================
   CLASE AUTH SERVICE
========================================= */

/*
Administra toda la lógica de autenticación y persistencia de sesión activa.
Permite iniciar/cerrar sesión, recuperar credenciales del usuario actual
y restringir accesos a vistas protegidas del sistema.
*/
class AuthService {
  /* =====================================
     LOGIN
  ====================================== */

  /*
    Procesa las credenciales enviadas por el formulario.
    Si el correo y la contraseña coinciden con un usuario activo,
    genera un token o registro de sesión en LocalStorage.
  */
  login(email, password) {
    /* Normalizamos el correo para evitar problemas con mayúsculas o espacios */
    const emailNormalizado = String(email).trim().toLowerCase();

    /* Consultamos la lista de usuarios registrados */
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    /* Buscamos coincidencia exacta de credenciales y estado activo */
    const usuario = usuarios.find(
      (item) =>
        String(item.email).trim().toLowerCase() === emailNormalizado &&
        item.password === password &&
        item.activo !== false,
    );

    /* Si no se encuentra coincidencia, detenemos el proceso */
    if (!usuario) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    /* Creamos y guardamos la sesión utilizando únicamente el ID como referencia */
    storageService.guardar(STORAGE_KEYS.SESION, {
      usuarioId: usuario.id,
      fechaInicio: new Date().toISOString(),
    });

    return usuario;
  }

  /* =====================================
     LOGOUT
  ====================================== */

  /* Borra los datos de la clave SESION dejando el sistema desautenticado */
  logout() {
    storageService.eliminar(STORAGE_KEYS.SESION);
    return true;
  }

  /* =====================================
     USUARIO ACTUAL
  ====================================== */

  /* Retorna el objeto del usuario autenticado actualmente en el sistema */
  getCurrentUser() {
    const sesion = storageService.obtener(STORAGE_KEYS.SESION, null);

    if (!sesion || !sesion.usuarioId) {
      return null;
    }

    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    /* Retorna el usuario en línea o null si el usuario fue removido */
    return usuarios.find((u) => u.id === sesion.usuarioId) || null;
  }

  /* =====================================
     PROTECCIÓN DE RUTAS
  ====================================== */

  /*
    Guarda de navegación: Verifica la existencia de una sesión activa.
    Si no hay un usuario autenticado, redirige automáticamente a la pantalla de login.
  */
  protegerRuta() {
    const usuario = this.getCurrentUser();

    if (!usuario) {
      window.location.href = 'index.html';
      return false;
    }

    return true;
  }
}

/* =========================================
   EXPORTAR INSTANCIA ÚNICA (SINGLETON)
========================================= */

export const authService = new AuthService();