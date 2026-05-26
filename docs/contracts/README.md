# Contrato JSON - AgroGreen Smart System

Este directorio contiene el contrato JSON base del sistema AgroGreen Smart System.

## Archivo principal

- `agrogreen-api-contract.v1.json`

## Propósito

El contrato JSON define la estructura de intercambio de datos entre:

- Backend Spring Boot
- Frontend React/Vite
- Pruebas JUnit
- Pruebas Python de API
- Pruebas Selenium
- Documentación técnica del sistema

## Contenido del contrato

El contrato incluye:

- Información general del proyecto
- Reglas globales de autenticación
- Roles del sistema
- Estados permitidos
- Módulos funcionales
- Esquemas de request y response
- Endpoints principales
- Permisos por rol
- Ejemplos JSON de entrada y salida

## Módulos cubiertos

- Estado del sistema
- Autenticación
- Usuarios
- Invernaderos
- Zonas
- Cultivos
- Sensores
- Lecturas de sensores
- Actuadores
- Reglas de automatización
- Alertas
- Dashboard

## Uso

Este contrato funciona como fuente de referencia para validar que el backend, el frontend y las pruebas automáticas usan la misma estructura de datos.

También sirve como base para construir posteriormente:

- Diccionario de datos
- Documentación de API
- Matriz de requerimientos
- Matriz de criterios de aceptación
- Manual técnico