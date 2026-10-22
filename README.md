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
- BancoService
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
## Banco
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
- AuthService
- registro
- login
- logout
- sesión
- SweetAlert2
- DOM
- eventos
- dashboard.html
## Dashboard
- consume información bancaria
- muestra saldo
- muestra cuentas
- muestra movimientos
## Versión actual
v0.7.0 — BancoService y Dashboard bancario.