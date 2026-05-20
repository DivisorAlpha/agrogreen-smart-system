# Módulo de Invernaderos

## Objetivo

Gestionar la información principal de los invernaderos registrados en el sistema AgroGreen Smart System.

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/greenhouses | Lista todos los invernaderos |
| GET | /api/greenhouses/{id} | Consulta un invernadero por id |
| POST | /api/greenhouses | Crea un nuevo invernadero |
| PUT | /api/greenhouses/{id} | Actualiza un invernadero existente |
| DELETE | /api/greenhouses/{id} | Elimina un invernadero |

## Entidad principal

Greenhouse.

## Campos

| Campo | Tipo | Descripción |
|---|---|---|
| id | Long | Identificador único |
| name | String | Nombre del invernadero |
| location | String | Ubicación |
| description | String | Descripción |
| status | String | Estado del invernadero |
| createdAt | LocalDateTime | Fecha de creación |
| updatedAt | LocalDateTime | Fecha de actualización |

## Evidencia

- Backend ejecutado correctamente.
- Tabla greenhouses creada en PostgreSQL.
- Endpoints probados en navegador/Postman.