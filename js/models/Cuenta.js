/* =========================================
IMPORTAR UTILIDADES
========================================= */
// Importamos generarId() para asignar automáticamente un identificador interno a cada cuenta.
import { generarId } from '../utils/helpers.js';
/* =========================================
MODELO CUENTA
Representa una cuenta bancaria perteneciente a un usuario.
========================================= */
export class Cuenta {
constructor({
id = generarId(),
numeroCuenta,
/* Si no se indica otro tipo, utilizaremos Ahorro. */
tipo = 'Ahorro',
saldo = 0,
//Identificador del usuario propietario de la cuenta.
usuarioId,
fechaApertura = new Date().toISOString(),
activa = true,
}) {
/* =================================
ASIGNAR PROPIEDADES
================================= */
this.id = id;
this.numeroCuenta = numeroCuenta;
this.tipo = tipo;
this.saldo = Number(saldo);
this.usuarioId = usuarioId;
this.fechaApertura = fechaApertura;
this.activa = activa;
}
/* =====================================
DEPOSITAR
Incrementa el saldo actual utilizando el monto recibido.
===================================== */
depositar(monto) {
this.saldo += Number(monto);
return this.saldo;
}
/* =====================================
RETIRAR
Disminuye el saldo actual utilizando el monto recibido.
===================================== */
retirar(monto) {
this.saldo -= Number(monto);
return this.saldo;
}
}