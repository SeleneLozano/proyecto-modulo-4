# Sistema de Gestión Bancaria
Proyecto integrador correspondiente al Módulo 4.
El proyecto utiliza JavaScript moderno, programación orientada a objetos, programación funcional,
arquitectura modular, manipulación del DOM, LocalStorage, librerías externas y testing automatizado.
## Tecnologías
- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- LocalStorage
- SweetAlert2
- Jest
- jsdom
- Git
- GitHub
## Arquitectura
```text
js/
├── main.js
│
├── models/
│ ├── Banco.js
│ ├── Cuenta.js
│ ├── Movimiento.js
│ └── Usuario.js
│
├── services/
│ ├── AuthService.js
│ ├── BancoService.js
│ └── StorageService.js
│
├── ui/
│ ├── CuentaUI.js
│ ├── DashboardUI.js
│ ├── MovimientosUI.js
│ └── TransferenciasUI.js
│
└── utils/
├── formatters.js
├── helpers.js
└── validators.js
```
## Páginas
- `index.html`
- `dashboard.html`
- `cuenta.html`
- `movimientos.html`
- `transferencia.html`
## Funcionalidades
El sistema permite:
- Registrar usuarios.
- Crear cuentas.
- Iniciar sesión.
- Mantener sesión.
- Cerrar sesión.
- Proteger páginas.
- Consultar dashboard.
- Consultar datos bancarios.
- Modificar perfil.
- Cambiar contraseña.
- Eliminar cuenta.
- Realizar depósitos.
- Realizar transferencias.
- Actualizar saldos.
- Registrar movimientos.
- Consultar movimientos.
- Filtrar depósitos.
- Filtrar transferencias enviadas.
- Filtrar transferencias recibidas.
- Persistir información con LocalStorage.
## Testing
El proyecto utiliza Jest para pruebas automatizadas.
Como el proyecto trabaja con ECMAScript Modules se ejecuta Jest mediante:
```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
El entorno configurado es:
```text
jsdom
```
porque algunos servicios dependen de APIs propias del navegador como LocalStorage.
## Ejecutar las pruebas
Instalar dependencias:
```bash
npm install
```
Ejecutar todas las pruebas:
```bash
npm test
```
Ejecutar una suite:
```bash
npm test -- BancoService.test.js
```
Ejecutar una prueba por nombre:
```bash
npm test -- -t "debe realizar y persistir una transferencia"
```
## Suites de pruebas
Actualmente existen:
- `validators.test.js`
- `helpers.test.js`
- `Usuario.test.js`
- `Cuenta.test.js`
- `Movimiento.test.js`
- `AuthService.test.js`
- `Banco.test.js`
- `BancoService.test.js`
## Cobertura funcional de las pruebas
Las pruebas validan:
### Utilidades
- Campos obligatorios.
- Montos.
- Generación de IDs.
- Generación de números de cuenta.
### Usuario
- Creación de usuario.
- Generación de ID.
- Estado inicial.
### Cuenta
- Creación.
- Depósitos.
- Retiros.
- Saldo insuficiente.
### Movimiento
- Creación.
- Identificador.
- Fecha.
### AuthService
- Login correcto.
- Login incorrecto.
- Usuario autenticado.
- Logout.
### Banco
- Transferencias.
- Actualización de saldos.
- Movimientos enviados.
- Movimientos recibidos.
- Misma cuenta.
- Saldo insuficiente.
### BancoService
- Persistencia de depósitos.
- Persistencia de transferencias.
- Actualización de usuarios.
- Reglas de eliminación.
## Resultado esperado
```text
Test Suites: 8 passed, 8 total
Tests: 26 passed, 26 total
Snapshots: 0 total
```
## Control de versiones
El proyecto se desarrolló incrementalmente:
```text
v0.1.0 Estructura inicial
v0.2.0 Arquitectura modular
v0.3.0 Modelos POO
v0.4.0 Dominio bancario
v0.5.0 LocalStorage
v0.6.0 Autenticación
v0.7.0 Dashboard
v0.8.0 Gestión de cuenta
v0.9.0 Transferencias
v0.10.0 Movimientos
v0.11.0 Testing
```
## Próxima versión
La siguiente versión será:
```text
v1.0.0
```
y estará enfocada en:
- Revisión integral.
- Refactorización.
- Pruebas finales.
- Limpieza del proyecto.
- Revisión de navegación.
- Documentación final.
- Release estable.
## Versión actual
v0.11.0 — Testing automatizado con Jest.