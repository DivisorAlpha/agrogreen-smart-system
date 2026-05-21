# Módulo de Sensores

## Objetivo

Gestionar los sensores instalados en cada zona del invernadero.

## Relación principal

Una zona puede tener varios sensores.

Zone 1 ---- N Sensor

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/sensors | Lista todos los sensores |
| GET | /api/sensors/{id} | Consulta un sensor por id |
| GET | /api/sensors/code/{code} | Consulta un sensor por código |
| GET | /api/sensors/zone/{zoneId} | Lista sensores asociados a una zona |
| POST | /api/sensors | Crea un sensor |
| PUT | /api/sensors/{id} | Actualiza un sensor |
| DELETE | /api/sensors/{id} | Elimina un sensor |

## JSON de creación

```json
{
  "zoneId": 1,
  "code": "TEMP-001",
  "name": "Sensor de temperatura zona norte",
  "type": "TEMPERATURE",
  "unit": "°C",
  "minValue": 0.0,
  "maxValue": 60.0
}