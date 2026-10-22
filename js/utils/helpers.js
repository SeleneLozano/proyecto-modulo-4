/* =========================================
   FUNCIONES AUXILIARES
========================================= */
export function generarId() {
    /* Date.now() devuelve la cantidad de milisegundos transcurridos desde el 1 de
       enero de 1970. */
    /* Math.random() genera un número pseudoaleatorio entre 0 y 1. */
    return `${Date.now()}-${Math.random()
        .toString(36)
        /* Tomamos solamente una parte del resultado generado. */
        .substring(2, 9)}`;
}