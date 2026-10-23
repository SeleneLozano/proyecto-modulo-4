/* =========================================
   MODELO DE CUENTA
========================================= */

/* 
Importamos funciones auxiliares para generar el ID único
y el número de cuenta bancario correspondiente.
*/
import { generarId, generarNumeroCuenta } from '../utils/helpers.js';

/* =========================================
   CLASE CUENTA
========================================= */

/*
Representa una cuenta bancaria perteneciente a un usuario.
Maneja el estado de la cuenta, tipo, saldo y las operaciones
básicas de modificación de saldo (depósitos y retiros).
*/
export class Cuenta {
  /* =====================================
     CONSTRUCTOR
  ====================================== */
  constructor({
    id = generarId(),
    numeroCuenta = generarNumeroCuenta(),
    tipo = 'Ahorro',
    saldo = 0,
    usuarioId = '',
    activa = true,
    fechaApertura = new Date().toISOString(),
  } = {}) {
    /* Identificador interno único de la cuenta */
    this.id = id;

    /* Número bancario (almacenado como String para preservar formato) */
    this.numeroCuenta = String(numeroCuenta);

    /* Tipo de cuenta (Ahorro, Corriente, etc.) */
    this.tipo = tipo;

    /* Saldo disponible normalizado a Number */
    this.saldo = Number(saldo) || 0;

    /* ID del usuario propietario de la cuenta */
    this.usuarioId = usuarioId;

    /* Estado de la cuenta (activa/inactiva) */
    this.activa = activa;

    /* Fecha de creación en formato ISO */
    this.fechaApertura = fechaApertura;
  }

  /* =====================================
     MÉTODOS DE OPERACIÓN
  ====================================== */

  /*
    depositar()
    Incrementa el saldo disponible de la cuenta tras validar el monto.
  */
  depositar(monto) {
    const cantidad = Number(monto);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      throw new Error('Monto inválido, el monto debe ser mayor a cero.');
    }

    this.saldo += cantidad;
    return this.saldo;
  }

  /*
    retirar()
    Descuenta una cantidad del saldo garantizando fondos suficientes.
  */
  retirar(monto) {
    const cantidad = Number(monto);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      throw new Error('Monto inválido, el monto debe ser mayor a cero.');
    }

    if (cantidad > this.saldo) {
      throw new Error('Saldo insuficiente.');
    }

    this.saldo -= cantidad;
    return this.saldo;
  }
}