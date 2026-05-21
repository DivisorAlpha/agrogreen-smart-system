# Módulo de Reglas de Automatización

## Objetivo

Gestionar reglas que permiten tomar decisiones automáticas a partir de lecturas de sensores y ejecutar comandos sobre actuadores.

## Relación lógica

SensorReading → AutomationRule → Actuator

## Ejemplo

Si TEMP-001 > 30 °C, entonces FAN-001 TURN_ON.

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/automation-rules | Lista todas las reglas |
| GET | /api/automation-rules/{id} | Consulta una regla por id |
| GET | /api/automation-rules/sensor/{sensorCode} | Lista reglas asociadas a un sensor |
| POST | /api/automation-rules | Crea una regla |
| PUT | /api/automation-rules/{id} | Actualiza una regla |
| POST | /api/automation-rules/evaluate/{sensorCode} | Evalúa las reglas del sensor y ejecuta acciones |
| DELETE | /api/automation-rules/{id} | Elimina una regla |

## JSON de creación

```json
{
  "name": "Encender ventilador por temperatura alta",
  "sensorCode": "TEMP-001",
  "operator": ">",
  "thresholdValue": 30.0,
  "actuatorCode": "FAN-001",
  "command": "TURN_ON"
}