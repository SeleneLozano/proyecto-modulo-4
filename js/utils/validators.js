/* =========================================
   VALIDACIONES GENERALES
========================================= */

/*
  Comprueba que un valor obligatorio realmente contenga información.
*/
export function validarCampoObligatorio(valor) {
  return (
    valor !== undefined &&
    valor !== null &&
    String(valor).trim() !== ''
  );
}

/* =========================================
   VALIDAR MONTO
========================================= */

/*
  Comprueba que el monto sea un número válido y estrictamente mayor a cero.
*/
export function validarMonto(monto) {
  const montoNumerico = Number(monto);

  return (
    Number.isFinite(montoNumerico) &&
    montoNumerico > 0
  );
}

/* =========================================
   VALIDAR CORREO ELECTRÓNICO
========================================= */

/*
  Verifica que el correo cumpla con un formato estándar (usuario@dominio.extensión).
*/
export function validarEmail(email) {
  if (!validarCampoObligatorio(email)) {
    return false;
  }

  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patronEmail.test(String(email).trim().toLowerCase());
}