/* =========================================
   MOVIMIENTOS UI
========================================= */
import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';
import {
  formatCurrency,
  formatDate,
} from '../utils/formatters.js';

/* =========================================
   ESTADO DE LA INTERFAZ
========================================= */
/* Conservamos el filtro seleccionado actualmente. */
let filtroActual = 'TODOS';

/* =========================================
   1. CIERRE DE SESIÓN
========================================= */
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
   2. PRESENTACIÓN Y FORMATO
========================================= */
/* Convierte los nombres internos en etiquetas legibles */
function obtenerEtiquetaTipo(tipo) {
  const etiquetas = {
    DEPOSITO: 'Depósito',
    TRANSFERENCIA_ENVIADA: 'Transferencia enviada',
    TRANSFERENCIA_RECIBIDA: 'Transferencia recibida',
  };
  return etiquetas[tipo] || tipo;
}

/* Define el signo correspondiente según el tipo de movimiento */
function obtenerSignoMovimiento(tipo) {
  return tipo === 'TRANSFERENCIA_ENVIADA' ? '-' : '+';
}

/* Define la clase CSS correspondiente para la entrada o salida de dinero */
function obtenerClaseMovimiento(tipo) {
  return tipo === 'TRANSFERENCIA_ENVIADA'
    ? 'movimiento-salida'
    : 'movimiento-entrada';
}

/* =========================================
   3. COMPONENTES DE RENDER
========================================= */
/* Genera el HTML de cada botón de filtro */
function crearBotonFiltro(filtro, etiqueta) {
  return `
    <button
      type="button"
      class="filtro-btn ${filtroActual === filtro ? 'active' : ''}"
      data-filtro="${filtro}"
    >
      ${etiqueta}
    </button>
  `;
}

/* Genera la tabla completa del historial */
function crearTablaMovimientos(movimientos) {
  return `
    <div class="table-wrapper">
      <table class="movimientos-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${movimientos
            .map((movimiento) => {
              const signo = obtenerSignoMovimiento(movimiento.tipo);
              const clase = obtenerClaseMovimiento(movimiento.tipo);

              return `
                <tr>
                  <td>${formatDate(movimiento.fecha)}</td>
                  <td>
                    <span class="movimiento-tipo ${clase}">
                      ${obtenerEtiquetaTipo(movimiento.tipo)}
                    </span>
                  </td>
                  <td>${movimiento.descripcion || 'Sin descripción'}</td>
                  <td class="movimiento-monto ${clase}">
                    ${signo}${formatCurrency(movimiento.monto)}
                  </td>
                  <td>${formatCurrency(movimiento.saldoResultante)}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* =========================================
   4. RENDER PRINCIPAL
========================================= */
function renderMovimientos(usuario) {
  const root = document.querySelector('#movimientosRoot');
  if (!root) return;

  const resumen = bancoService.obtenerResumenMovimientos(usuario.id);
  const movimientos = bancoService.obtenerMovimientosUsuario(
    usuario.id,
    filtroActual
  );

  root.innerHTML = `
    <!-- ENCABEZADO -->
    <section class="movimientos-header">
      <span class="dashboard-label">Actividad bancaria</span>
      <h2>Historial de movimientos</h2>
      <p>Consulta las operaciones realizadas en tus cuentas.</p>
    </section>

    <!-- RESUMEN -->
    <section class="movimientos-summary">
      <article class="movimiento-summary-card">
        <span>Todos</span>
        <strong>${resumen.total}</strong>
      </article>
      <article class="movimiento-summary-card">
        <span>Depósitos</span>
        <strong>${resumen.depositos}</strong>
      </article>
      <article class="movimiento-summary-card">
        <span>Enviadas</span>
        <strong>${resumen.enviadas}</strong>
      </article>
      <article class="movimiento-summary-card">
        <span>Recibidas</span>
        <strong>${resumen.recibidas}</strong>
      </article>
    </section>

    <!-- PANEL DEL HISTORIAL -->
    <section class="movimientos-panel">
      <header class="movimientos-toolbar">
        <div>
          <h3>Operaciones</h3>
          <p>Filtra el historial por tipo de movimiento.</p>
        </div>

        <!-- BOTONES DE FILTRO -->
        <div class="movimientos-filtros">
          ${crearBotonFiltro('TODOS', 'Todos')}
          ${crearBotonFiltro('DEPOSITO', 'Depósitos')}
          ${crearBotonFiltro('TRANSFERENCIA_ENVIADA', 'Enviadas')}
          ${crearBotonFiltro('TRANSFERENCIA_RECIBIDA', 'Recibidas')}
        </div>
      </header>

      ${
        movimientos.length === 0
          ? `
            <div class="movimientos-empty">
              <strong>No hay movimientos para mostrar.</strong>
              <p>Realiza un depósito o una transferencia para generar actividad.</p>
            </div>
            `
          : crearTablaMovimientos(movimientos)
      }
    </section>
  `;

  initFiltros(usuario);
}

/* =========================================
   5. GESTIÓN DE FILTROS
========================================= */
function initFiltros(usuario) {
  document.querySelectorAll('[data-filtro]').forEach((boton) => {
    boton.addEventListener('click', () => {
      filtroActual = boton.dataset.filtro;
      renderMovimientos(usuario);
    });
  });
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
    renderMovimientos(usuario);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'No fue posible cargar los movimientos',
      text: error.message,
    });
  }
}

if (document.querySelector('.app-movimientos')) {
  init();
}