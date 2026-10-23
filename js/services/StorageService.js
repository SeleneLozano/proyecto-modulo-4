/* =========================================
   STORAGE SERVICE
========================================= */

/*
Centralizamos las claves que usaremos en LocalStorage.
Esto nos evita errores tipográficos y facilita mantener 
las claves sincronizadas en todo el proyecto.
*/
export const STORAGE_KEYS = {
  USUARIOS: 'usuarios',
  CUENTAS: 'cuentas',
  MOVIMIENTOS: 'movimientos',
  SESION: 'sesion',
};

/* =========================================
   CLASE STORAGE SERVICE
========================================= */

/*
Funciona como wrapper o intermediario con LocalStorage.
Encapsula la conversión de JSON (stringify/parse) para
que el resto de la aplicación maneje objetos directos de JS.
*/
class StorageService {
  /* =========================================
     GUARDAR INFORMACIÓN
  ========================================= */
  
  /* Convierte la estructura a JSON y la persiste en el navegador */
  guardar(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
    return valor;
  }

  /* =========================================
     OBTENER INFORMACIÓN
  ========================================= */

  /*
    Recupera y parsea los datos. Si la clave no existe o si el
    contenido guardado está corrupto, retorna de forma segura el valor por defecto.
  */
  obtener(clave, valorPorDefecto = null) {
    const contenido = localStorage.getItem(clave);

    if (contenido === null) {
      return valorPorDefecto;
    }

    try {
      return JSON.parse(contenido);
    } catch {
      // Si el JSON está mal formado, evitamos que la app colapse
      return valorPorDefecto;
    }
  }

  /* =========================================
     ELIMINAR ESTRUCTURAS
  ========================================= */

  /* Remueve una clave específica sin afectar los demás datos */
  eliminar(clave) {
    localStorage.removeItem(clave);
  }

  /* Borra todo el almacenamiento local (útil para un reseteo total) */
  limpiar() {
    localStorage.clear();
  }

  /* =========================================
     INICIALIZAR COLECCIONES
  ========================================= */

  /*
    Asegura la existencia de las colecciones base del banco (arrays vacíos)
    para evitar errores de tipo "undefined" o "null" al iniciar la app.
  */
  inicializarColecciones() {
    const coleccionesBase = [
      STORAGE_KEYS.USUARIOS,
      STORAGE_KEYS.CUENTAS,
      STORAGE_KEYS.MOVIMIENTOS,
    ];

    coleccionesBase.forEach((clave) => {
      if (this.obtener(clave, null) === null) {
        this.guardar(clave, []);
      }
    });
  }
}

/* =========================================
   INSTANCIA ÚNICA (SINGLETON)
========================================= */

/* Exportamos la instancia lista para importar en cualquier módulo */
export const storageService = new StorageService();
