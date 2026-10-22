/* =========================================
   1. IMPORTACIONES
========================================= */
import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';
import { formatCurrency, formatAccountNumber } from '../utils/formatters.js';

/* =========================================
   2. RENDERIZADO DEL DASHBOARD
========================================= */
function renderDashboard(resumen) {
  const root = document.querySelector('#dashboardRoot');
  
  if (!root) {
    return;
  }

  const {
    usuario,
    cuentas,
    saldoTotal,
    totalCuentas,
    totalMovimientos,
  } = resumen;

  const cuentaPrincipal = cuentas[0] || null;

  // Renderizado dinámico del contenido HTML
  root.innerHTML = `
    <!-- SECCIÓN BIENVENIDA -->
    <section class="dashboard-welcome">
      <div>
        <p class="dashboard-label">Bienvenido</p>
        <h2>${usuario.nombre}</h2>
        <p>Consulta el estado actual de tus cuentas.</p>
      </div>
      <button type="button" id="logoutBtn" class="btn btn-primary">
        Cerrar sesión
      </button>
    </section>

    <!-- SECCIÓN RESUMEN BANCARIO -->
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

    <!-- SECCIÓN DETALLE DE CUENTA PRINCIPAL -->
    <section class="dashboard-section">
      <header class="section-header">
        <div>
          <span>Cuenta principal</span>
          <h3>Información bancaria</h3>
        </div>
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
          : `
          <p>No tienes cuentas bancarias registradas.</p>
          `
      }
    </section>
  `;
}

/* =========================================
   3. GESTIÓN DE CERRAR SESIÓN
========================================= */
function initLogout() {
  const btn = document.querySelector('#logoutBtn');

  if (!btn) {
    return;
  }

  btn.addEventListener('click', () => {
    Swal.fire({
      icon: 'question',
      title: 'Cerrar sesión',
      text: '¿Seguro que deseas salir?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      authService.logout();
      window.location.href = 'index.html';
    });
  });
}

/* =========================================
   4. INICIALIZACIÓN DE LA VISTA
========================================= */
function init() {
  const accesoPermitido = authService.protegerRuta();

  if (!accesoPermitido) {
    return;
  }

  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    // Reconstruir estado desde LocalStorage y consultar datos
    bancoService.recargarBanco();
    const resumen = bancoService.obtenerResumenUsuario(usuario.id);

    // Renderizar interfaz y configurar listeners
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

// Ejecutar al cargar el módulo
init();