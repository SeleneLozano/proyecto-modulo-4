/* =========================================
   DASHBOARD UI
========================================= */

/* Servicios necesarios para sesión y datos bancarios */
import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';

/* Formateadores utilizados para presentar los datos */
import {
  formatCurrency,
  formatAccountNumber,
} from '../utils/formatters.js';

/* =========================================
   1. RENDERIZADO DEL DASHBOARD
========================================= */

/*
  Recibe el resumen generado por BancoService
  y construye dinámicamente el contenido del Dashboard.
*/
function renderDashboard(resumen) {
  /* Contenedor principal definido en dashboard.html */
  const root = document.querySelector('#dashboardRoot');
  if (!root) return;

  /* Extraemos únicamente las propiedades que necesitamos mostrar */
  const {
    usuario,
    cuentas,
    saldoTotal,
    totalCuentas,
    totalMovimientos,
  } = resumen;

  /* Tomamos la primera cuenta como cuenta principal del usuario */
  const cuentaPrincipal = cuentas[0] || null;

  /* Inyectamos la plantilla HTML con los datos interpolados */
  root.innerHTML = `
    <!-- BIENVENIDA -->
    <section class="dashboard-welcome">
      <div>
        <p class="dashboard-label">Bienvenido</p>
        <h2>${usuario.nombre}</h2>
        <p>Consulta el estado actual de tus cuentas.</p>
      </div>
    </section>

    <!-- RESUMEN GENERAL -->
    <section class="summary-grid">
      <article class="summary-card">
        <span>Saldo total</span>
        <strong>${formatCurrency(saldoTotal)}</strong>
      </article>
      <article class="summary-card">
        <span>Cuentas</span>
        <strong>${totalCuentas}</strong>
      </article>
      <article class="summary-card">
        <span>Movimientos</span>
        <strong>${totalMovimientos}</strong>
      </article>
    </section>

    <!-- CUENTA PRINCIPAL -->
    <section class="dashboard-section">
      <header class="section-header">
        <span>Cuenta principal</span>
        <h3>Información bancaria</h3>
      </header>

      ${
        cuentaPrincipal
          ? `
          <article class="account-card">
            <div>
              <span>Número de cuenta</span>
              <strong>${formatAccountNumber(cuentaPrincipal.numeroCuenta)}</strong>
            </div>
            <div>
              <span>Tipo</span>
              <strong>${cuentaPrincipal.tipo}</strong>
            </div>
            <div>
              <span>Saldo disponible</span>
              <strong>${formatCurrency(cuentaPrincipal.saldo)}</strong>
            </div>
          </article>
          `
          : '<p>No tienes cuentas bancarias registradas.</p>'
      }
    </section>
  `;
}

/* =========================================
   2. CIERRE DE SESIÓN
========================================= */

function initLogout() {
  const btn = document.querySelector('#logoutBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    /* Solicitamos confirmación con SweetAlert2 */
    Swal.fire({
      icon: 'question',
      title: 'Cerrar sesión',
      text: '¿Seguro que deseas salir?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      /* Eliminamos la sesión y regresamos al login */
      authService.logout();
      window.location.href = 'index.html';
    });
  });
}

/* =========================================
   3. INICIALIZACIÓN DE LA VISTA
========================================= */

function init() {
  /* Protegemos el Dashboard impidiendo accesos sin sesión */
  if (!authService.protegerRuta()) return;

  /* Recuperamos el usuario autenticado */
  const usuario = authService.getCurrentUser();
  if (!usuario) return;

  try {
    /* Sincronizamos Banco con LocalStorage */
    bancoService.recargarBanco();

    /* Calculamos el resumen del usuario */
    const resumen = bancoService.obtenerResumenUsuario(usuario.id);

    /* Construimos el Dashboard y asociamos eventos */
    renderDashboard(resumen);
    initLogout();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'No fue posible cargar el dashboard',
      text: error.message,
    });
  }
}

/*
  Ejecutamos init() únicamente cuando nos
  encontramos en la vista del Dashboard.
*/
if (document.querySelector('.app-dashboard')) {
  init();
}