# Módulo de Lecturas de Sensores

## Objetivo

Registrar, consultar y validar las lecturas generadas por los sensores instalados en las zonas del invernadero.

## Relación principal

Un sensor puede tener muchas lecturas.

Sensor 1 ---- N SensorReading

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/sensor-readings | Lista todas las lecturas |
| GET | /api/sensor-readings/{id} | Consulta una lectura por id |
| GET | /api/sensor-readings/sensor/{sensorId} | Lista lecturas por id del sensor |
| GET | /api/sensor-readings/sensor-code/{sensorCode} | Lista lecturas por código del sensor |
| GET | /api/sensor-readings/sensor-code/{sensorCode}/latest | Consulta la última lectura del sensor |
| POST | /api/sensor-readings | Crea una lectura |
| PUT | /api/sensor-readings/{id} | Actualiza una lectura |
| DELETE | /api/sensor-readings/{id} | Elimina una lectura |

## JSON de creación

```json
{
  "sensorCode": "TEMP-001",
  "value": 28.5,
  "readingDateTime": "2026-05-20T18:45:00",
  "source": "MANUAL"
} 