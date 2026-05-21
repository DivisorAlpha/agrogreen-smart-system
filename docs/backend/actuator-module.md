# Módulo de Actuadores

## Objetivo

Gestionar los dispositivos físicos encargados de ejecutar acciones dentro del invernadero, como ventilación, riego, iluminación o extracción.

## Relación principal

Una zona puede tener varios actuadores.

Zone 1 ---- N Actuator

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/actuators | Lista todos los actuadores |
| GET | /api/actuators/{id} | Consulta un actuador por id |
| GET | /api/actuators/code/{code} | Consulta un actuador por código |
| GET | /api/actuators/zone/{zoneId} | Lista actuadores asociados a una zona |
| POST | /api/actuators | Crea un actuador |
| PUT | /api/actuators/{id} | Actualiza un actuador |
| PATCH | /api/actuators/code/{code}/command | Ejecuta un comando sobre el actuador |
| DELETE | /api/actuators/{id} | Elimina un actuador |

## JSON de creación

```json
{
  "zoneId": 1,
  "code": "FAN-001",
  "name": "Ventilador zona norte",
  "type": "FAN",
  "state": "OFF",
  "operationalStatus": "ACTIVE"
}