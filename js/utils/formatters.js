/* =========================================
FORMATEADORES DE INFORMACIÓN
========================================= */
/* Convierte un valor numérico a una representación monetaria utilizando pesos
mexicanos. */
export function formatCurrency(valor) {
const numero = Number(valor);
if (!Number.isFinite(numero)) {
return '$0.00';
}
//APLICAR FORMATO DE MONEDA
return numero.toLocaleString('es-MX', {
style: 'currency',
currency: 'MXN',
});
}
/* =========================================
FORMATEAR FECHA
========================================= */
/* Convierte una fecha a una representación más amigable utilizando la
configuración regional de México. */
export function formatDate(fecha) {
const fechaObjeto = new Date(fecha);
if (Number.isNaN(fechaObjeto.getTime())) {
return '';
}
return fechaObjeto.toLocaleDateString('es-MX');
}
/* =========================================
FORMATEAR NÚMERO DE CUENTA
========================================= */
export function formatAccountNumber(numeroCuenta) {
const numero = String(numeroCuenta ?? '');
//SEPARAR GRUPOS DE CUATRO DÍGITOS
return numero.replace(
/(\d{4})(?=\d)/g,
'$1 ',
);
}