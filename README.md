# Sistema de Gestión Bancaria
Proyecto integrador correspondiente al Módulo 4.
El objetivo es desarrollar progresivamente un sistema bancario utilizando
JavaScript moderno, arquitectura modular, programación orientada a objetos y
programación funcional.
## Tecnologías
- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- Git
- GitHub
## Arquitectura
El proyecto utilizará las siguientes capas:
- Models
- Services
- UI
- Utils
- Tests
## Funcionalidades previstas
Durante las siguientes versiones se desarrollarán:
- Registro de usuarios.
- Inicio de sesión.
- Gestión de cuentas.
- Depósitos.
- Transferencias.
- Historial de movimientos.
- Persistencia con LocalStorage.
- Manipulación del DOM.
- Manejo de eventos.
- Validaciones.
- Formateadores.
- Librerías visuales.
- Pruebas automatizadas con Jest.
- Git y GitHub.
## Modelos del dominio
- Usuario
- Cuenta
- Movimiento
## Nuevo Modelo: Banco
- agregarUsuario()
- buscarUsuarioPorId()
- agregarCuenta()
- buscarCuentaPorId()
- buscarCuentaPorNumero()
- obtenerCuentasDeUsuario()
- registrarMovimiento()
- obtenerMovimientosDeCuenta()
- realizarDeposito()
## Services
- StorageService.js
- LocalStorage
- JSON.stringify()
- JSON.parse()
- STORAGE_KEYS
## Versión actual
v0.5.0 — Persistencia con LocalStorage y StorageService.