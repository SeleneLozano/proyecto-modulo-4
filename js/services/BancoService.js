/* =========================================
   BANCO SERVICE
========================================= */

/*
Importamos nuestros modelos principales.
Los utilizaremos para reconstruir los objetos almacenados 
en LocalStorage y recuperar nuevamente sus métodos.
*/
import { Banco } from '../models/Banco.js';
import { Usuario } from '../models/Usuario.js';
import { Cuenta } from '../models/Cuenta.js';
import { Movimiento } from '../models/Movimiento.js';

/*
Importamos nuestro servicio de persistencia (Singleton)
y las claves centralizadas de LocalStorage.
*/
import { STORAGE_KEYS, storageService } from './StorageService.js';

/* =========================================
   CLASE BANCO SERVICE
========================================= */

/*
BancoService funciona como intermediario de capa de negocio:
INTERFAZ <--> BancoService <--> MODELOS <--> StorageService <--> LocalStorage

Evita colocar la lógica bancaria compleja directamente dentro de la interfaz gráfica.
*/
class BancoService {
  /* =========================================
     CONSTRUCTOR
  ========================================= */
  constructor() {
    /* Instancia interna de Banco que se mantendrá en memoria */
    this._banco = null;
  }

  /* =========================================
     CARGA Y PERSISTENCIA DE DATOS
  ========================================= */

  /*
    cargarBanco()
    Recupera los datos crudos almacenados en LocalStorage y reconstruye
    las instancias reales de las clases del dominio.
  */
  cargarBanco() {
    const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
    const movimientosGuardados = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

    // Reconstrucción de instancias
    const usuarios = usuariosGuardados.map((u) => new Usuario(u));
    const cuentas = cuentasGuardadas.map((c) => new Cuenta(c));
    const movimientos = movimientosGuardados.map((m) => new Movimiento(m));

    // Instanciación del objeto Banco coordinador
    this._banco = new Banco({ usuarios, cuentas, movimientos });
    return this._banco;
  }

  /*
    obtenerInstanciaBanco()
    Devuelve la instancia actual del Banco. Si todavía no se ha cargado en memoria,
    ejecuta cargarBanco() automáticamente.
  */
  obtenerInstanciaBanco() {
    return this._banco || this.cargarBanco();
  }

  /*
    recargarBanco()
    Forzar la reconstrucción completa del Banco desde LocalStorage.
  */
  recargarBanco() {
    this._banco = null;
    return this.cargarBanco();
  }

  /*
    guardarBanco()
    Guarda en LocalStorage el estado actual de las colecciones del Banco.
  */
  guardarBanco() {
    const banco = this.obtenerInstanciaBanco();

    storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
    storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);

    return true;
  }

  /* =========================================
     CONSULTAS Y RESÚMENES DE USUARIO
  ========================================= */

  /*
    obtenerDatosUsuario()
    Obtiene la información bancaria completa de un usuario (instancia de usuario,
    cuentas vinculadas y movimientos asociados sin duplicados).
  */
  obtenerDatosUsuario(usuarioId) {
    const banco = this.obtenerInstanciaBanco();
    const usuario = banco.buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      throw new Error('El usuario no existe.');
    }

    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);
    const cuentasIds = cuentas.map((cuenta) => cuenta.id);

    // Filtrar los movimientos relacionados únicamente con las cuentas del usuario
    const movimientos = banco.movimientos.filter((movimiento) => {
      if (movimiento.tipo === 'DEPOSITO') {
        return cuentasIds.includes(movimiento.cuentaOrigen);
      }
      if (movimiento.tipo === 'TRANSFERENCIA_ENVIADA') {
        return cuentasIds.includes(movimiento.cuentaOrigen);
      }
      if (movimiento.tipo === 'TRANSFERENCIA_RECIBIDA') {
        return cuentasIds.includes(movimiento.cuentaDestino);
      }
      return false;
    });

    return { usuario, cuentas, movimientos };
  }

  /*
    obtenerResumenUsuario()
    Construye un resumen cuantitativo listo para ser desplegado en el Dashboard.
  */
  obtenerResumenUsuario(usuarioId) {
    const { usuario, cuentas, movimientos } = this.obtenerDatosUsuario(usuarioId);

    // Acumula el saldo de todas las cuentas registradas del usuario
    const saldoTotal = cuentas.reduce(
      (acumulado, cuenta) => acumulado + Number(cuenta.saldo),
      0,
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

  /* =========================================
     CONSULTAS DE MOVIMIENTOS Y HISTORIAL
  ========================================= */

  /*
    obtenerMovimientosUsuario()
    Recupera el historial de movimientos de un usuario ordenado cronológicamente.
    Permite filtrado opcional por tipo ('TODOS', 'DEPOSITO', etc.).
  */
  obtenerMovimientosUsuario(usuarioId, tipo = 'TODOS') {
    const { movimientos } = this.obtenerDatosUsuario(usuarioId);
    let resultado = [...movimientos];

    if (tipo !== 'TODOS') {
      resultado = resultado.filter((m) => m.tipo === tipo);
    }

    // Ordenar de más reciente a más antiguo
    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return resultado;
  }

  /*
    obtenerResumenMovimientos()
    Calcula el conteo por categoría de operaciones realizadas por el usuario.
  */
  obtenerResumenMovimientos(usuarioId) {
    const movimientos = this.obtenerMovimientosUsuario(usuarioId);

    return {
      total: movimientos.length,
      depositos: movimientos.filter((m) => m.tipo === 'DEPOSITO').length,
      enviadas: movimientos.filter((m) => m.tipo === 'TRANSFERENCIA_ENVIADA').length,
      recibidas: movimientos.filter((m) => m.tipo === 'TRANSFERENCIA_RECIBIDA').length,
    };
  }

  /* =========================================
     OPERACIONES BANCARIAS
  ========================================= */

  /*
    realizarDeposito()
    Delega la validación e incremento de saldo al objeto Banco y persiste los cambios.
  */
  realizarDeposito({ cuentaId, monto, descripcion = '' }) {
    const banco = this.obtenerInstanciaBanco();
    const movimiento = banco.realizarDeposito({ cuentaId, monto, descripcion });

    this.guardarBanco();
    return movimiento;
  }

  /*
    realizarTransferencia()
    Localiza la cuenta destino por número bancario y ejecuta la transferencia.
  */
  realizarTransferencia({
    cuentaOrigenId,
    numeroCuentaDestino,
    monto,
    descripcion = '',
  }) {
    const banco = this.obtenerInstanciaBanco();

    const numeroDestino = String(numeroCuentaDestino).replace(/\s/g, '').trim();
    const cuentaDestino = banco.buscarCuentaPorNumero(numeroDestino);

    if (!cuentaDestino) {
      throw new Error('La cuenta destino no existe.');
    }

    const resultado = banco.realizarTransferencia({
      cuentaOrigenId,
      cuentaDestinoId: cuentaDestino.id,
      monto,
      descripcion,
    });

    this.guardarBanco();
    return resultado;
  }

  /* =========================================
     ADMINISTRACIÓN DE PERFIL Y CONFIGURACIÓN
  ========================================= */

  /*
    actualizarUsuario()
    Modifica datos personales comprobando que el correo no esté registrado por otro usuario.
  */
  actualizarUsuario(usuarioId, { nombre, email, telefono }) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error('El usuario no existe.');
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    // Validar duplicidad
    const emailDuplicado = usuarios.some(
      (item) =>
        String(item.email).toLowerCase() === emailNormalizado &&
        item.id !== usuarioId,
    );

    if (emailDuplicado) {
      throw new Error('Ya existe un usuario con este correo.');
    }

    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            nombre: nombre.trim(),
            email: emailNormalizado,
            telefono: telefono.trim(),
          }
        : item,
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);
    this.recargarBanco();

    return usuariosActualizados.find((item) => item.id === usuarioId) || null;
  }

  /*
    cambiarPassword()
    Valida credenciales anteriores y requisitos de seguridad para actualizar la contraseña.
  */
  cambiarPassword(usuarioId, passwordActual, passwordNueva) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error('El usuario no existe.');
    }

    if (usuario.password !== passwordActual) {
      throw new Error('La contraseña actual no es correcta.');
    }

    if (passwordNueva === passwordActual) {
      throw new Error('La nueva contraseña debe ser diferente.');
    }

    if (passwordNueva.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
    }

    const actualizados = usuarios.map((item) =>
      item.id === usuarioId ? { ...item, password: passwordNueva } : item,
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, actualizados);
    this.recargarBanco();

    return true;
  }

  /*
    eliminarUsuario()
    Borra un usuario y sus registros asociados únicamente si sus cuentas no poseen saldo.
  */
  eliminarUsuario(usuarioId) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
    const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);
    if (!usuario) {
      throw new Error('El usuario no existe.');
    }

    const cuentasUsuario = cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);

    // Validación de fondos existentes
    const tieneSaldo = cuentasUsuario.some((cuenta) => Number(cuenta.saldo) > 0);
    if (tieneSaldo) {
      throw new Error('No puedes eliminar tu cuenta mientras tengas saldo disponible.');
    }

    const cuentasIds = cuentasUsuario.map((cuenta) => cuenta.id);

    // Limpieza de colecciones asociadas
    storageService.guardar(
      STORAGE_KEYS.USUARIOS,
      usuarios.filter((item) => item.id !== usuarioId),
    );

    storageService.guardar(
      STORAGE_KEYS.CUENTAS,
      cuentas.filter((cuenta) => cuenta.usuarioId !== usuarioId),
    );

    storageService.guardar(
      STORAGE_KEYS.MOVIMIENTOS,
      movimientos.filter(
        (movimiento) =>
          !cuentasIds.includes(movimiento.cuentaOrigen) &&
          !cuentasIds.includes(movimiento.cuentaDestino),
      ),
    );

    this.recargarBanco();
    return true;
  }
}

/* =========================================
   EXPORTAR INSTANCIA ÚNICA (SINGLETON)
========================================= */
export const bancoService = new BancoService();