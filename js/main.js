/* =========================================
   1. IMPORTAR VALIDADORES, HELPERS Y FORMATEADORES
========================================= */
import {
  validarCampoObligatorio,
  validarMonto,
} from './utils/validators.js';

import {
  generarId,
} from './utils/helpers.js';

import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from './utils/formatters.js';

/* =========================================
   2. IMPORTAR MODELOS Y SERVICIOS
========================================= */
import { Usuario } from './models/Usuario.js';
import { Cuenta } from './models/Cuenta.js';
import { Movimiento } from './models/Movimiento.js';
import { Banco } from './models/Banco.js';
import { STORAGE_KEYS, storageService } from './services/StorageService.js';

/* =========================================
   3. FUNCIONES DE PERSISTENCIA
========================================= */

// Guardar el estado completo del banco
function guardarBanco(banco) {
  storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
  storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
  storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
}

// Cargar y reconstruir las instancias del banco
function cargarBanco() {
  const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
  const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
  const movimientosGuardados = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

  const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));
  const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));
  const movimientos = movimientosGuardados.map((movimiento) => new Movimiento(movimiento));

  return new Banco({
    usuarios,
    cuentas,
    movimientos,
  });
}

/* =========================================
   4. INICIALIZACIÓN DEL BANCO
========================================= */
const bancoDemo = cargarBanco();

// Si el banco está vacío, creamos los datos iniciales
if (bancoDemo.usuarios.length === 0) {
  const usuarioDemo = new Usuario({
    nombre: 'Juan Suarez',
    email: 'juan@correo.com',
    telefono: '5512345678',
    password: '123456',
  });

  bancoDemo.agregarUsuario(usuarioDemo);

  const cuentaDemo = new Cuenta({
    numeroCuenta: '123456789012',
    usuarioId: usuarioDemo.id,
  });

  bancoDemo.agregarCuenta(cuentaDemo);

  bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: 1000,
    descripcion: 'Depósito inicial',
  });

  guardarBanco(bancoDemo);
}

/* =========================================
   5. OBTENER REFERENCIAS DE PRUEBA
========================================= */
const usuarioPrincipal = bancoDemo.usuarios[0] || null;
const cuentaPrincipal = bancoDemo.cuentas[0] || null;
const cuentasUsuario = usuarioPrincipal ? bancoDemo.obtenerCuentasDeUsuario(usuarioPrincipal.id) : [];

/* =========================================
   6. LOGS Y COMPROBACIONES
========================================= */

// Comprobación de saldo e instancia
if (cuentaPrincipal) {
  console.log('Saldo persistido:', formatCurrency(cuentaPrincipal.saldo));
  console.log('¿La cuenta recuperada sigue siendo una instancia de Cuenta?', cuentaPrincipal instanceof Cuenta);
}

// Estado recuperado del banco
console.log('Banco recuperado:', bancoDemo);
console.log('Usuarios almacenados:', bancoDemo.usuarios);
console.log('Cuentas almacenadas:', bancoDemo.cuentas);
console.log('Movimientos almacenados:', bancoDemo.movimientos);

/* =========================================
   7. PRUEBAS DE REGULARES Y REGLAS NEGATIVAS
========================================= */
if (usuarioPrincipal) {
  const usuarioEncontrado = bancoDemo.buscarUsuarioPorId(usuarioPrincipal.id);
  console.log('Usuario encontrado:', usuarioEncontrado);
  console.log('Cuentas del usuario:', cuentasUsuario);
}

// Prueba de regla negativa (Monto inválido)
try {
  if (cuentaPrincipal) {
    bancoDemo.realizarDeposito({
      cuentaId: cuentaPrincipal.id,
      monto: -500,
    });
  }
} catch (error) {
  console.log('Error controlado:', error.message);
}