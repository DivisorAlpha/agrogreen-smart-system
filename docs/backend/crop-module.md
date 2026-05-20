# Módulo de Cultivos

## Objetivo

Gestionar los cultivos registrados en cada zona del invernadero.

## Relación principal

Una zona puede tener varios cultivos.

Zone 1 ---- N Crop

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/crops | Lista todos los cultivos |
| GET | /api/crops/{id} | Consulta un cultivo por id |
| GET | /api/crops/zone/{zoneId} | Lista cultivos asociados a una zona |
| POST | /api/crops | Crea un cultivo |
| PUT | /api/crops/{id} | Actualiza un cultivo |
| DELETE | /api/crops/{id} | Elimina un cultivo |

## JSON de creación

```json
{
  "zoneId": 1,
  "name": "Tomate",
  "scientificName": "Solanum lycopersicum",
  "plantingDate": "2026-05-20",
  "estimatedHarvestDate": "2026-08-20"
}