/* =========================================
   CLAVES DE ALMACENAMIENTO
   Centralizamos los nombres de todas las claves utilizadas por LocalStorage.
   ========================================= */
export const STORAGE_KEYS = {
  USUARIOS: 'usuarios',
  CUENTAS: 'cuentas',
  MOVIMIENTOS: 'movimientos',
  SESION: 'sesion',
};

/* Esta clase centraliza toda la comunicación con LocalStorage. */
class StorageService {
  /* =========================================
     GUARDAR INFORMACIÓN
     Recibe: 
       clave → dónde guardaremos la información.
       valor → dato que queremos almacenar.
     ========================================= */
  guardar(clave, valor) {
    const valorJSON = JSON.stringify(valor);
    /* Guardamos el JSON utilizando la clave recibida. */
    localStorage.setItem(clave, valorJSON);
  }

  /* =========================================
     OBTENER INFORMACIÓN
     clave: indica qué información queremos recuperar.
     valorPorDefecto: será retornado cuando no exista información almacenada.
     ========================================= */
  obtener(clave, valorPorDefecto = null) {
    /* getItem() devuelve el contenido almacenado como texto. Si la clave no existe devuelve null. */
    const valor = localStorage.getItem(clave);

    // VALIDAR SI EXISTE INFORMACIÓN
    if (valor === null) {
      return valorPorDefecto;
    }

    // CONVERTIR JSON
    try {
      return JSON.parse(valor);
    } catch (error) {
      // Si el JSON almacenado es inválido, evitamos detener la aplicación.
      console.error(`No fue posible leer la clave "${clave}" de LocalStorage.`, error);
      /* Si ocurre un error regresamos el valor predeterminado. */
      return valorPorDefecto;
    }
  }

  /* =========================================
     ELIMINAR INFORMACIÓN
     Elimina únicamente la clave recibida sin afectar el resto de LocalStorage.
     ========================================= */
  eliminar(clave) {
    localStorage.removeItem(clave);
  }

  /* =========================================
     LIMPIAR LOCALSTORAGE
     ========================================= */
  limpiar() {
    localStorage.clear();
  }
}

/* =========================================
   CREAR INSTANCIA DEL SERVICIO
   Creamos una sola instancia que podrá reutilizarse desde diferentes módulos.
   ========================================= */
export const storageService = new StorageService();
