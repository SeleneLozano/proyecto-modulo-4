/* =========================================
   MODELO MOVIMIENTO
========================================= */

/* Importamos generarId para asignar un identificador único a cada transacción */
import { generarId } from '../utils/helpers.js';

/* =========================================
   CLASE MOVIMIENTO
========================================= */

/*
Representa una operación bancaria realizada dentro del sistema
(Depósito, Transferencia Enviada o Transferencia Recibida).
*/
export class Movimiento {
  /* =====================================
     CONSTRUCTOR
  ====================================== */
  constructor({
    id = generarId(),
    tipo = '',
    monto = 0,
    descripcion = '',
    cuentaOrigen = null,
    cuentaDestino = null,
    saldoResultante = 0,
    fecha = new Date().toISOString(),
  } = {}) {
    /* Identificador único del movimiento */
    this.id = id;

    /* Tipo de operación (DEPOSITO, TRANSFERENCIA_ENVIADA, TRANSFERENCIA_RECIBIDA) */
    this.tipo = tipo;

    /* Cantidad de dinero involucrada */
    this.monto = Number(monto) || 0;

    /* Información adicional sobre la transacción */
    this.descripcion = descripcion;

    /* ID de la cuenta que origina el movimiento */
    this.cuentaOrigen = cuentaOrigen;

    /* ID de la cuenta receptora (cuando aplica) */
    this.cuentaDestino = cuentaDestino;

    /* Saldo restante en la cuenta tras la operación */
    this.saldoResultante = Number(saldoResultante) || 0;

    /* Fecha y hora del movimiento en formato ISO */
    this.fecha = fecha;
  }
}