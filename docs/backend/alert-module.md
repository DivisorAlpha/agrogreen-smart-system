# Módulo de Alertas

## Objetivo

Registrar y gestionar alertas generadas por el sistema cuando una lectura de sensor se encuentra fuera del rango permitido.

## Relación principal

SensorReading → Alert

## Estados

| Estado | Descripción |
|---|---|
| OPEN | Alerta activa o pendiente de revisión |
| RESOLVED | Alerta atendida o cerrada |

## Niveles iniciales

| Nivel | Descripción |
|---|---|
| WARNING | Advertencia por condición anormal |
| CRITICAL | Condición crítica del sistema |
| INFO | Información relevante del sistema |

## Endpoints

| Método | Endpoint | Descripción |
|---|---|
| GET | /api/alerts | Lista todas las alertas |
| GET | /api/alerts/{id} | Consulta una alerta por id |
| GET | /api/alerts/status/{status} | Lista alertas por estado |
| GET | /api/alerts/sensor/{sensorCode} | Lista alertas por sensor |
| GET | /api/alerts/sensor/{sensorCode}/open | Lista alertas abiertas por sensor |
| POST | /api/alerts | Crea una alerta manual |
| PATCH | /api/alerts/{id}/resolve | Resuelve una alerta |
| DELETE | /api/alerts/{id} | Elimina una alerta |

## Generación automática

Cuando se crea una lectura mediante:

POST /api/sensor-readings

si la lectura queda con estado OUT_OF_RANGE, el sistema genera automáticamente una alerta OPEN.

## Ejemplo

```json
{
  "sensorCode": "TEMP-001",
  "value": 80.0,
  "source": "MANUAL"
}