/* =========================================
IMPORTAR VALIDADORES, HELPERS Y FORMATEADORES
========================================= */
// Importamos las funciones encargadas de validar información.
import {
validarCampoObligatorio,
validarMonto,
} from './utils/validators.js';
// Importamos nuestra función auxiliar encargada de generar identificadores.
import {
generarId,
} from './utils/helpers.js';
// Importamos las funciones utilizadas para preparar los datos antes de mostrarlos al usuario.
import {
    formatCurrency,
formatDate,
formatAccountNumber,
} from './utils/formatters.js';
/* =========================================
PUNTO DE ENTRADA DE LA APLICACIÓN
========================================= */
// Mostramos la versión actual del proyecto
console.log('Sistema de Gestión Bancaria - v0.2.0');
// Validación de campo debe mostrar true
console.log(
'Campo obligatorio:',
validarCampoObligatorio('Banco Digital'),
);
// Probar validación del monto debe regresar True
console.log(
'Monto válido:',
validarMonto(1000),
);
// Generamos un identificador dinámico
console.log(
'ID generado:',
generarId(),
);
// Convertimos 1500 a formato monetario MXN
console.log(
'Monto formateado:',
formatCurrency(1500),
);
// Formateamos la fecha actual
console.log(
'Fecha formateada:',
formatDate(new Date()),
);
// Separamos visualmente cada cuatro dígitos
console.log(
'Número de cuenta:',
formatAccountNumber('123456789012'),
);