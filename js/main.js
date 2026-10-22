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
   2. IMPORTAR MODELOS
========================================= */
import { Usuario } from './models/Usuario.js';
import { Cuenta } from './models/Cuenta.js';
import { Banco } from './models/Banco.js';

/* =========================================
   3. INICIALIZACIÓN Y CONFIGURACIÓN DEMO
========================================= */
// Instancia del Banco
const bancoDemo = new Banco();

// Instancia de Usuario
const usuarioDemo = new Usuario({
  nombre: 'Juan Suarez',
  email: 'juan@correo.com',
  telefono: '5512345678',
  password: '123456',
});

bancoDemo.agregarUsuario(usuarioDemo);

// Instancia de Cuenta
const cuentaDemo = new Cuenta({
  numeroCuenta: '123456789012',
  usuarioId: usuarioDemo.id,
});

bancoDemo.agregarCuenta(cuentaDemo);

// Operación de Depósito desde Banco
const depositoDemo = bancoDemo.realizarDeposito({
  cuentaId: cuentaDemo.id,
  monto: 1000,
  descripcion: 'Depósito inicial',
});

// Obtener cuentas del usuario
const cuentasUsuario = bancoDemo.obtenerCuentasDeUsuario(usuarioDemo.id);

/* =========================================
   4. LOGS Y PRUEBAS DEL SISTEMA (v0.4.0)
========================================= */
// Mensaje inicial de versión
console.log('Sistema de Gestión Bancaria - v0.4.0');

// Pruebas de validación, id y formateo
console.log('Campo obligatorio:', validarCampoObligatorio('Banco Digital'));
console.log('Monto válido:', validarMonto(1000));
console.log('ID generado:', generarId());
console.log('Monto formateado:', formatCurrency(1500));
console.log('Fecha formateada:', formatDate(new Date()));
console.log('Número de cuenta:', formatAccountNumber('123456789012'));

// Usuarios y Cuentas registradas en el banco
console.log('Usuarios registrados:', bancoDemo.usuarios);
console.log('Cuentas registradas:', bancoDemo.cuentas);

// Saldo actual formateado
console.log('Saldo actual:', formatCurrency(cuentaDemo.saldo));

// Operaciones e Historial
console.log('Movimiento generado:', depositoDemo);
console.log('Movimientos registrados:', bancoDemo.movimientos);

// Búsquedas y filtros
const usuarioEncontrado = bancoDemo.buscarUsuarioPorId(usuarioDemo.id);
console.log('Usuario encontrado:', usuarioEncontrado);
console.log('Cuentas del usuario:', cuentasUsuario);

// Prueba de Regla Negativa (Error controlado por monto inválido)
try {
  bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: -500,
  });
} catch (error) {
  console.log('Error controlado:', error.message);
}