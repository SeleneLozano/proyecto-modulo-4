/* =========================================
   MI CUENTA UI
========================================= */

/*
Importamos AuthService para trabajar con la sesión activa
y BancoService para consultar y modificar la información del usuario.
*/
import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';

/*
Importamos funciones encargadas de formatear
moneda, fechas y números de cuenta.
*/
import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from '../utils/formatters.js';

/* Importamos la validación del correo electrónico */
import { validarEmail } from '../utils/validators.js';

/* =========================================
   1. CIERRE DE SESIÓN
========================================= */

/*
Inicializa el evento del botón "Cerrar sesión".
SweetAlert2 solicita confirmación antes de destruir la sesión actual.
*/
function initLogout() {
  const btn = document.querySelector('#logoutBtn');

  if (!btn) return;

  btn.addEventListener('click', () => {
    Swal.fire({
      icon: 'question',
      title: 'Cerrar sesión',
      text: '¿Seguro que deseas salir?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      authService.logout();
      window.location.href = 'index.html';
    });
  });
}

/* =========================================
   2. RENDERIZADO DE LA INTERFAZ
========================================= */

/*
Construye dinámicamente la plantilla de "Mi Cuenta".
Recibe la información personal del usuario y la cuenta bancaria principal.
*/
function renderCuenta(usuario, cuenta) {
  const root = document.querySelector('#cuentaRoot');

  if (!root || !usuario || !cuenta) return;

  root.innerHTML = `
    <section class="cuenta-layout">
      <!-- DETALLES DE LA CUENTA -->
      <article class="cuenta-card">
        <header class="cuenta-card-header">
          <div>
            <h2>${usuario.nombre}</h2>
            <p class="cuenta-meta">Titular de la cuenta</p>
          </div>
          <span class="badge ${cuenta.activa ? 'badge-success' : 'badge-danger'}">
            ${cuenta.activa ? 'Activa' : 'Inactiva'}
          </span>
        </header>

        <section class="cuenta-detalle">
          <p>
            <strong>Número de cuenta:</strong>
            ${formatAccountNumber(cuenta.numeroCuenta)}
          </p>
          <p><strong>Tipo:</strong> ${cuenta.tipo}</p>
          <p><strong>Saldo actual:</strong> ${formatCurrency(cuenta.saldo)}</p>
          <p><strong>Fecha de apertura:</strong> ${formatDate(cuenta.fechaApertura)}</p>
        </section>
      </article>

      <!-- PANELES DE FORMULARIOS -->
      <section class="cuenta-panel">
        <!-- INFORMACIÓN PERSONAL -->
        <article class="cuenta-section">
          <h3>Información personal</h3>
          <form id="formInfoPersonal" class="cuenta-form" novalidate>
            <div class="form-group">
              <label for="infoNombre">Nombre completo</label>
              <input id="infoNombre" type="text" value="${usuario.nombre}">
              <p class="field-error" data-error-for="infoNombre"></p>
            </div>

            <div class="form-group">
              <label for="infoEmail">Correo electrónico</label>
              <input id="infoEmail" type="email" value="${usuario.email}">
              <p class="field-error" data-error-for="infoEmail"></p>
            </div>

            <div class="form-group">
              <label for="infoTelefono">Teléfono</label>
              <input id="infoTelefono" type="tel" value="${usuario.telefono || ''}">
              <p class="field-error" data-error-for="infoTelefono"></p>
            </div>

            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </form>
        </article>

        <!-- SEGURIDAD -->
        <article class="cuenta-section">
          <h3>Seguridad</h3>
          <form id="formSeguridad" class="cuenta-form" novalidate>
            <div class="form-group">
              <label for="segPasswordActual">Contraseña actual</label>
              <input id="segPasswordActual" type="password">
              <p class="field-error" data-error-for="segPasswordActual"></p>
            </div>

            <div class="form-group">
              <label for="segPasswordNueva">Nueva contraseña</label>
              <input id="segPasswordNueva" type="password">
              <p class="field-error" data-error-for="segPasswordNueva"></p>
            </div>

            <div class="form-group">
              <label for="segPasswordConfirmar">Confirmar nueva contraseña</label>
              <input id="segPasswordConfirmar" type="password">
              <p class="field-error" data-error-for="segPasswordConfirmar"></p>
            </div>

            <button type="submit" class="btn btn-primary">Cambiar contraseña</button>
          </form>
        </article>

        <!-- ELIMINACIÓN DE CUENTA -->
        <article class="cuenta-section cuenta-section-danger">
          <h3>Zona peligrosa</h3>
          <p class="cuenta-warning">Eliminar tu cuenta es una acción irreversible.</p>
          <button type="button" id="btnEliminarCuenta" class="btn btn-danger">
            Eliminar mi cuenta
          </button>
        </article>
      </section>
    </section>
  `;

  /* Registramos los eventos para los nuevos elementos inyectados */
  inicializarFormulariosCuenta(usuario);
}

/* =========================================
   3. GESTIÓN DE ERRORES EN PANTALLA
========================================= */

/* Inserta el texto de error debajo del campo correspondiente */
function mostrarError(campoId, mensaje) {
  const elemento = document.querySelector(`[data-error-for="${campoId}"]`);
  if (elemento) elemento.textContent = mensaje;
}

/* Limpia los mensajes de error activos */
function limpiarErroresCuenta() {
  document.querySelectorAll('.field-error').forEach((elemento) => {
    elemento.textContent = '';
  });
}

/* =========================================
   4. MANEJADORES DE OPERACIONES
========================================= */

/* Procesa la actualización de datos de contacto y perfil */
function manejarActualizarInfo(event, usuario) {
  event.preventDefault();
  limpiarErroresCuenta();

  const nombre = document.querySelector('#infoNombre').value.trim();
  const email = document.querySelector('#infoEmail').value.trim().toLowerCase();
  const telefono = document.querySelector('#infoTelefono').value.trim();

  let valido = true;

  if (!nombre) {
    mostrarError('infoNombre', 'El nombre es obligatorio.');
    valido = false;
  }

  if (!email || !validarEmail(email)) {
    mostrarError('infoEmail', 'Ingresa un correo válido.');
    valido = false;
  }

  if (!telefono) {
    mostrarError('infoTelefono', 'El teléfono es obligatorio.');
    valido = false;
  }

  if (!valido) return;

  try {
    const actualizado = bancoService.actualizarUsuario(usuario.id, {
      nombre,
      email,
      telefono,
    });

    Swal.fire({
      icon: 'success',
      title: 'Datos actualizados',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      const { cuentas } = bancoService.obtenerDatosUsuario(actualizado.id);
      renderCuenta(actualizado, cuentas[0]);
    });
  } catch (error) {
    mostrarError('infoEmail', error.message);
  }
}

/* Procesa el cambio de credenciales del usuario */
function manejarCambiarPassword(event, usuario) {
  event.preventDefault();
  limpiarErroresCuenta();

  const actual = document.querySelector('#segPasswordActual').value.trim();
  const nueva = document.querySelector('#segPasswordNueva').value.trim();
  const confirmar = document.querySelector('#segPasswordConfirmar').value.trim();

  let valido = true;

  if (!actual) {
    mostrarError('segPasswordActual', 'Ingresa tu contraseña actual.');
    valido = false;
  }

  if (!nueva || nueva.length < 6) {
    mostrarError('segPasswordNueva', 'La nueva contraseña debe tener al menos 6 caracteres.');
    valido = false;
  }

  if (nueva === actual) {
    mostrarError('segPasswordNueva', 'La nueva contraseña debe ser diferente.');
    valido = false;
  }

  if (!confirmar || confirmar !== nueva) {
    mostrarError('segPasswordConfirmar', 'Las contraseñas no coinciden.');
    valido = false;
  }

  if (!valido) return;

  try {
    bancoService.cambiarPassword(usuario.id, actual, nueva);
    document.querySelector('#formSeguridad').reset();

    Swal.fire({
      icon: 'success',
      title: 'Contraseña actualizada',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    mostrarError('segPasswordActual', error.message);
  }
}

/* Solicita confirmación y ejecuta la eliminación del usuario si cumple las reglas */
function manejarEliminarCuenta(usuario) {
  Swal.fire({
    icon: 'warning',
    title: 'Eliminar cuenta',
    text: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar mi cuenta',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
  }).then((result) => {
    if (!result.isConfirmed) return;

    try {
      bancoService.eliminarUsuario(usuario.id);
      authService.logout();

      Swal.fire({
        icon: 'success',
        title: 'Cuenta eliminada',
        text: 'Tu usuario y sus datos han sido eliminados.',
        confirmButtonText: 'Continuar',
      }).then(() => {
        window.location.href = 'index.html';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text: error.message,
      });
    }
  });
}

/* =========================================
   5. ASIGNACIÓN DE EVENTOS
========================================= */

/* Asigna los listeners a los formularios inyectados dinámicamente */
function inicializarFormulariosCuenta(usuario) {
  document.querySelector('#formInfoPersonal')?.addEventListener(
    'submit',
    (event) => manejarActualizarInfo(event, usuario),
  );

  document.querySelector('#formSeguridad')?.addEventListener(
    'submit',
    (event) => manejarCambiarPassword(event, usuario),
  );

  document.querySelector('#btnEliminarCuenta')?.addEventListener(
    'click',
    () => manejarEliminarCuenta(usuario),
  );
}

/* =========================================
   6. INICIALIZACIÓN DE LA VISTA
========================================= */

function init() {
  if (!authService.protegerRuta()) return;

  initLogout();

  const usuario = authService.getCurrentUser();
  if (!usuario) return;

  try {
    bancoService.recargarBanco();
    const { cuentas } = bancoService.obtenerDatosUsuario(usuario.id);
    const cuentaPrincipal = cuentas[0] || null;

    if (!cuentaPrincipal) {
      Swal.fire({
        icon: 'error',
        title: 'Cuenta no encontrada',
        text: 'No existe una cuenta bancaria asociada a este usuario.',
      });
      return;
    }

    renderCuenta(usuario, cuentaPrincipal);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'No fue posible cargar la cuenta',
      text: error.message,
    });
  }
}

/* Se ejecuta únicamente si el contenedor base de la página está presente */
if (document.querySelector('.app-cuenta')) {
  init();
}