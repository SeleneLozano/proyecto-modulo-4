/* =========================================
   IMPORTAR MODELOS Y SERVICIOS
========================================= */
import { Banco } from '../models/Banco.js';
import { Usuario } from '../models/Usuario.js';
import { Cuenta } from '../models/Cuenta.js';
import { Movimiento } from '../models/Movimiento.js';
import { STORAGE_KEYS, storageService } from './StorageService.js';

/* =========================================
   SERVICIO BANCARIO
========================================= */
class BancoService {
  constructor() {
    this._banco = null;
  }

  /* =========================================
     CARGAR BANCO
     Recupera los datos almacenados en LocalStorage y reconstruye
     las instancias de las clases del dominio.
  ========================================= */
  cargarBanco() {
    const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
    const movimientosGuardados = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

    // Reconstruir instancias
    const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));
    const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));
    const movimientos = movimientosGuardados.map((movimiento) => new Movimiento(movimiento));

    // Crear la instancia de Banco
    this._banco = new Banco({
      usuarios,
      cuentas,
      movimientos,
    });

    return this._banco;
  }

  /* =========================================
     OBTENER INSTANCIA DE BANCO
     Devuelve la instancia actual de Banco. Si no existe, la carga primero.
  ========================================= */
  obtenerInstanciaBanco() {
    if (!this._banco) {
      return this.cargarBanco();
    }
    return this._banco;
  }

  /* =========================================
     RECARGAR BANCO
     Obliga al servicio a reconstruir nuevamente el Banco.
  ========================================= */
  recargarBanco() {
    this._banco = null;
    return this.cargarBanco();
  }

  /* =========================================
     GUARDAR BANCO
     Guarda en LocalStorage el estado actual del banco.
  ========================================= */
  guardarBanco() {
    const banco = this.obtenerInstanciaBanco();

    storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
    storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);

    return true;
  }

  /* =========================================
     OBTENER DATOS DE USUARIO
     Recupera la información bancaria (usuario, cuentas y movimientos sin duplicar).
  ========================================= */
  obtenerDatosUsuario(usuarioId) {
    const banco = this.obtenerInstanciaBanco();
    const usuario = banco.buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      throw new Error('El usuario no existe.');
    }

    // Obtener cuentas asociadas
    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

    // Obtener todos los movimientos asociados a sus cuentas
    const movimientosSinFiltrar = cuentas.flatMap((cuenta) =>
      banco.obtenerMovimientosDeCuenta(cuenta.id)
    );

    // Eliminar movimientos duplicados por ID
    const movimientos = movimientosSinFiltrar.filter(
      (movimiento, index, array) =>
        index === array.findIndex((item) => item.id === movimiento.id)
    );

    return {
      usuario,
      cuentas,
      movimientos,
    };
  }

  /* =========================================
     OBTENER RESUMEN DE USUARIO
     Construye un resumen listo para ser consumido por el Dashboard.
  ========================================= */
  obtenerResumenUsuario(usuarioId) {
    const { usuario, cuentas, movimientos } = this.obtenerDatosUsuario(usuarioId);

    // Sumar el saldo total de todas sus cuentas
    const saldoTotal = cuentas.reduce(
      (acumulado, cuenta) => acumulado + Number(cuenta.saldo),
      0
    );

    return {
      usuario,
      cuentas,
      movimientos,
      saldoTotal,
      totalCuentas: cuentas.length,
      totalMovimientos: movimientos.length,
    };
  }
}

/* =========================================
   EXPORTAR INSTANCIA ÚNICA (SINGLETON)
========================================= */
export const bancoService = new BancoService();