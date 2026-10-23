/* =========================================
   TRANSFERENCIAS UI
========================================= */
import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';
import {
  formatCurrency,
  formatAccountNumber,
} from '../utils/formatters.js';
import {
  validarMonto,
  validarCampoObligatorio,
} from '../utils/validators.js';

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
   2. RENDER DEL FORMULARIO
========================================= */
/*
  Construye los formularios de transferencia y depósito.
  Recibe el usuario autenticado y sus cuentas asociadas.
*/
function renderFormulario(usuario, cuentas) {
  const root = document.querySelector('#transferenciaRoot');
  if (!root) return;

  const cuentaPrincipal = cuentas[0] || null;

  /* CASO: USUARIO SIN CUENTAS */
  if (!cuentaPrincipal) {
    root.innerHTML = `
      <section class="transferencia-card">
        <h2>No tienes cuentas disponibles.</h2>
      </section>
    `;
    return;
  }

  /* INTERFAZ DE OPERACIONES */
  root.innerHTML = `
    <!-- ENCABEZADO Y SALDO -->
    <section class="transferencia-header">
      <div>
        <span class="dashboard-label">Operaciones bancarias</span>
        <h2>Transferir dinero</h2>
        <p>Realiza transferencias entre cuentas registradas.</p>
      </div>
      <article class="saldo-disponible">
        <span>Saldo disponible</span>
        <strong>${formatCurrency(cuentaPrincipal.saldo)}</strong>
      </article>
    </section>

    <section class="operaciones-grid">
      <!-- FORMULARIO DE TRANSFERENCIA -->
      <article class="transferencia-card">
        <h3>Nueva transferencia</h3>
        <form id="formTransferencia" novalidate>
          <div class="form-group">
            <label for="cuentaOrigen">Cuenta origen</label>
            <select id="cuentaOrigen">
              <option value="">Selecciona una cuenta</option>
              ${cuentas
                .map(
                  (cuenta) => `
                    <option value="${cuenta.id}">
                      ${formatAccountNumber(cuenta.numeroCuenta)} - ${formatCurrency(cuenta.saldo)}
                    </option>
                  `
                )
                .join('')}
            </select>
          </div>

          <div class="form-group">
            <label for="cuentaDestino">Número de cuenta destino</label>
            <input
              id="cuentaDestino"
              type="text"
              maxlength="14"
              placeholder="123456789012"
            >
          </div>

          <div class="form-group">
            <label for="montoTransferencia">Monto</label>
            <input
              id="montoTransferencia"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            >
          </div>

          <div class="form-group">
            <label for="descripcionTransferencia">Descripción</label>
            <input
              id="descripcionTransferencia"
              type="text"
              maxlength="80"
              placeholder="Concepto de la transferencia"
            >
          </div>

          <button type="submit" class="btn btn-primary">
            Confirmar transferencia
          </button>
        </form>
      </article>

      <!-- FORMULARIO DE DEPÓSITO -->
      <article class="transferencia-card">
        <h3>Depositar saldo</h3>
        <p class="operation-help">
          Utiliza esta operación para cargar saldo en tu cuenta durante la práctica.
        </p>

        <form id="formDeposito" novalidate>
          <div class="form-group">
            <label for="cuentaDeposito">Cuenta</label>
            <select id="cuentaDeposito">
              ${cuentas
                .map(
                  (cuenta) => `
                    <option value="${cuenta.id}">
                      ${formatAccountNumber(cuenta.numeroCuenta)}
                    </option>
                  `
                )
                .join('')}
            </select>
          </div>

          <div class="form-group">
            <label for="montoDeposito">Monto</label>
            <input
              id="montoDeposito"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            >
          </div>

          <button type="submit" class="btn btn-secondary">
            Realizar depósito
          </button>
        </form>
      </article>
    </section>
  `;

  initEventosOperaciones(usuario);
}

/* =========================================
   3. PROCESAMIENTO DE DEPÓSITOS
========================================= */
function manejarDeposito(event, usuario) {
  event.preventDefault();

  const cuentaId = document.querySelector('#cuentaDeposito').value;
  const monto = document.querySelector('#montoDeposito').value;

  if (!validarMonto(monto)) {
    Swal.fire({
      icon: 'warning',
      title: 'Monto inválido',
      text: 'El monto debe ser mayor a cero.',
    });
    return;
  }

  try {
    bancoService.realizarDeposito({
      cuentaId,
      monto,
      descripcion: 'Depósito desde interfaz',
    });

    Swal.fire({
      icon: 'success',
      title: 'Depósito exitoso',
      text: `Se depositaron ${formatCurrency(monto)}.`,
    }).then(() => recargarFormulario(usuario));
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'No fue posible depositar',
      text: error.message,
    });
  }
}

/* =========================================
   4. PROCESAMIENTO DE TRANSFERENCIAS
========================================= */
function manejarTransferencia(event, usuario) {
  event.preventDefault();

  const cuentaOrigenId = document.querySelector('#cuentaOrigen').value;
  const numeroCuentaDestino = document
    .querySelector('#cuentaDestino')
    .value.trim();
  const monto = document.querySelector('#montoTransferencia').value;
  const descripcion = document
    .querySelector('#descripcionTransferencia')
    .value.trim();

  if (!validarCampoObligatorio(cuentaOrigenId)) {
    Swal.fire({
      icon: 'warning',
      title: 'Selecciona la cuenta origen',
    });
    return;
  }

  if (!validarCampoObligatorio(numeroCuentaDestino)) {
    Swal.fire({
      icon: 'warning',
      title: 'Ingresa la cuenta destino',
    });
    return;
  }

  if (!validarMonto(monto)) {
    Swal.fire({
      icon: 'warning',
      title: 'Monto inválido',
      text: 'El monto debe ser mayor a cero.',
    });
    return;
  }

  Swal.fire({
    icon: 'question',
    title: 'Confirmar transferencia',
    html: `
      <p>Estás por transferir <strong>${formatCurrency(monto)}</strong></p>
      <p>Cuenta destino: <strong>${numeroCuentaDestino}</strong></p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Transferir',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (!result.isConfirmed) return;

    try {
      bancoService.realizarTransferencia({
        cuentaOrigenId,
        numeroCuentaDestino,
        monto,
        descripcion,
      });

      Swal.fire({
        icon: 'success',
        title: 'Transferencia exitosa',
        text: `${formatCurrency(monto)} fueron transferidos correctamente.`,
      }).then(() => recargarFormulario(usuario));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No fue posible realizar la transferencia',
        text: error.message,
      });
    }
  });
}

/* =========================================
   5. EVENTOS Y RECARGA
========================================= */
function initEventosOperaciones(usuario) {
  document.querySelector('#formTransferencia')?.addEventListener(
    'submit',
    (event) => manejarTransferencia(event, usuario)
  );

  document.querySelector('#formDeposito')?.addEventListener(
    'submit',
    (event) => manejarDeposito(event, usuario)
  );
}

function recargarFormulario(usuario) {
  bancoService.recargarBanco();
  const { cuentas } = bancoService.obtenerDatosUsuario(usuario.id);
  renderFormulario(usuario, cuentas);
}

/* =========================================
   6. INICIALIZACIÓN
========================================= */
function init() {
  if (!authService.protegerRuta()) return;

  initLogout();

  const usuario = authService.getCurrentUser();
  if (!usuario) return;

  try {
    bancoService.recargarBanco();
    const { cuentas } = bancoService.obtenerDatosUsuario(usuario.id);
    renderFormulario(usuario, cuentas);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'No fue posible cargar las operaciones',
      text: error.message,
    });
  }
}

if (document.querySelector('.app-transferencia')) {
  init();
}