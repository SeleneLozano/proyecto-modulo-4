/* =========================================
   IMPORTAR MODELO MOVIMIENTO
   Banco necesitará crear movimientos automáticamente 
   cuando se realicen operaciones como depósitos.
========================================= */
import { Movimiento } from './Movimiento.js';

/* =========================================
   MODELO BANCO
   Banco será el encargado de coordinar usuarios, cuentas y movimientos.
========================================= */
export class Banco {
  constructor({
    usuarios = [],
    cuentas = [],
    movimientos = [],
  } = {}) {
    this.usuarios = usuarios;
    this.cuentas = cuentas;
    this.movimientos = movimientos;
  }

  /* =========================================
     AGREGAR USUARIO (v0.4.0)
     Registra un usuario dentro del banco siempre que no 
     exista otro usuario con el mismo ID.
  ========================================= */
  agregarUsuario(usuario) {
    const existe = this.usuarios.some((u) => u.id === usuario.id);

    if (existe) {
      throw new Error('El usuario ya existe.');
    }

    this.usuarios.push(usuario);
    return usuario;
  }

  /* =========================================
     BUSCAR USUARIO POR ID (v0.4.0)
     Busca un usuario utilizando su identificador interno.
  ========================================= */
  buscarUsuarioPorId(usuarioId) {
    return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
  }

  /* =========================================
     AGREGAR CUENTA
     Registra una cuenta bancaria después de comprobar que 
     su propietario existe y que la cuenta no está duplicada.
  ========================================= */
  agregarCuenta(cuenta) {
    const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);

    if (!usuario) {
      throw new Error('El usuario propietario de la cuenta no existe.');
    }

    const existe = this.cuentas.some(
      (c) => c.id === cuenta.id || c.numeroCuenta === cuenta.numeroCuenta
    );

    if (existe) {
      throw new Error('La cuenta ya existe.');
    }

    this.cuentas.push(cuenta);
    return cuenta;
  }

  /* =========================================
     BUSCAR CUENTA POR ID (v0.4.0)
     Localiza una cuenta mediante su identificador interno.
  ========================================= */
  buscarCuentaPorId(cuentaId) {
    return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
  }

  /* =========================================
     BUSCAR CUENTA POR NÚMERO (v0.4.0)
     Localiza una cuenta utilizando su número bancario visible.
  ========================================= */
  buscarCuentaPorNumero(numeroCuenta) {
    return this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) || null;
  }

  /* =========================================
     OBTENER CUENTAS DE USUARIO (v0.4.0)
     Recupera todas las cuentas que pertenezcan al usuario indicado.
  ========================================= */
  obtenerCuentasDeUsuario(usuarioId) {
    return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
  }

  /* =========================================
     REGISTRAR MOVIMIENTO (v0.4.0)
     Agrega un movimiento al historial general del banco.
  ========================================= */
  registrarMovimiento(movimiento) {
    this.movimientos.push(movimiento);
    return movimiento;
  }

  /* =========================================
     REALIZAR DEPÓSITO (v0.4.0)
     Coordina toda la operación de depósito:
     1. Validar monto.
     2. Buscar cuenta.
     3. Actualizar saldo.
     4. Crear movimiento.
     5. Registrar movimiento.
  ========================================= */
  realizarDeposito({ cuentaId, monto, descripcion = '' }) {
    const montoNumerico = Number(monto);

    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error('Monto inválido, el monto debe ser mayor a cero.');
    }

    const cuenta = this.buscarCuentaPorId(cuentaId);
    if (!cuenta) {
      throw new Error('La cuenta no existe.');
    }

    // Actualizar saldo de la cuenta
    cuenta.depositar(montoNumerico);

    // Crear y registrar automáticamente la operación
    const movimiento = new Movimiento({
      tipo: 'DEPOSITO',
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: cuenta.id,
      saldoResultante: cuenta.saldo,
    });

    this.registrarMovimiento(movimiento);
    return movimiento;
  }

  /* =========================================
     OBTENER MOVIMIENTOS DE UNA CUENTA (v0.4.0)
     Devuelve todos los movimientos en los que la cuenta 
     aparezca como origen o como destino.
  ========================================= */
  obtenerMovimientosDeCuenta(cuentaId) {
    return this.movimientos.filter(
      (movimiento) =>
        movimiento.cuentaOrigen === cuentaId ||
        movimiento.cuentaDestino === cuentaId
    );
  }
}
