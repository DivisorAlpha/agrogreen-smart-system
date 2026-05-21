# Módulo Dashboard Summary

## Objetivo

Exponer un resumen general del estado del sistema AgroGreen Smart System para ser consumido por el frontend.

## Endpoint principal

GET /api/dashboard/summary

## Información entregada

- Total de invernaderos.
- Total de zonas.
- Total de cultivos.
- Total de sensores.
- Sensores activos.
- Total de actuadores.
- Actuadores encendidos.
- Total de reglas de automatización.
- Reglas activas.
- Alertas abiertas.
- Últimas lecturas.
- Últimas alertas abiertas.

## Uso en frontend

Este endpoint permite construir una pantalla principal tipo dashboard con tarjetas de indicadores y tablas breves de actividad reciente.

## Ejemplo de respuesta

```json
{
  "generatedAt": "2026-05-21T10:00:00",
  "totalGreenhouses": 1,
  "totalZones": 1,
  "totalCrops": 1,
  "totalSensors": 1,
  "activeSensors": 1,
  "totalActuators": 1,
  "actuatorsOn": 1,
  "totalAutomationRules": 1,
  "activeAutomationRules": 1,
  "openAlerts": 0,
  "latestReadings": [],
  "latestAlerts": []
}