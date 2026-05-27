# Modelo Entidad-Relación - AgroGreen Smart System

## 1. Descripción general

El presente modelo entidad-relación describe la estructura lógica de datos del sistema **AgroGreen Smart System**, una plataforma orientada a la gestión inteligente de invernaderos mediante el registro de invernaderos, zonas, cultivos, sensores, lecturas, actuadores, reglas de automatización, alertas y usuarios del sistema.

El modelo permite representar las relaciones principales entre los módulos funcionales implementados en el backend Spring Boot y consumidos por el frontend React/Vite.

---

## 2. Entidades principales

El sistema está compuesto por las siguientes entidades principales:

1. `user_accounts`
2. `greenhouses`
3. `zones`
4. `crops`
5. `sensors`
6. `sensor_readings`
7. `actuators`
8. `automation_rules`
9. `alerts`

---

## 3. Diagrama entidad-relación en Mermaid

```mermaid
erDiagram
    USER_ACCOUNT {
        BIGINT id PK
        VARCHAR full_name
        VARCHAR email
        VARCHAR password
        VARCHAR role
        VARCHAR status
        DATETIME created_at
    }

    GREENHOUSE {
        BIGINT id PK
        VARCHAR name
        VARCHAR location
        TEXT description
        VARCHAR status
        DATETIME created_at
    }

    ZONE {
        BIGINT id PK
        BIGINT greenhouse_id FK
        VARCHAR name
        TEXT description
    }

    CROP {
        BIGINT id PK
        BIGINT zone_id FK
        VARCHAR name
        VARCHAR variety
        DATE planting_date
        VARCHAR status
    }

    SENSOR {
        BIGINT id PK
        BIGINT zone_id FK
        VARCHAR code
        VARCHAR name
        VARCHAR type
        VARCHAR unit
        DECIMAL min_value
        DECIMAL max_value
        VARCHAR status
    }

    SENSOR_READING {
        BIGINT id PK
        BIGINT sensor_id FK
        DECIMAL value
        VARCHAR status
        DATETIME recorded_at
    }

    ACTUATOR {
        BIGINT id PK
        BIGINT zone_id FK
        VARCHAR code
        VARCHAR name
        VARCHAR type
        VARCHAR status
        DATETIME last_command_at
    }

    AUTOMATION_RULE {
        BIGINT id PK
        VARCHAR name
        VARCHAR sensor_code
        VARCHAR operator
        DECIMAL threshold_value
        VARCHAR actuator_code
        VARCHAR command
        BOOLEAN active
    }

    ALERT {
        BIGINT id PK
        BIGINT sensor_id FK
        VARCHAR type
        VARCHAR level
        TEXT message
        VARCHAR status
        DATETIME created_at
        DATETIME resolved_at
    }

    GREENHOUSE ||--o{ ZONE : contains
    ZONE ||--o{ CROP : has
    ZONE ||--o{ SENSOR : has
    ZONE ||--o{ ACTUATOR : has
    SENSOR ||--o{ SENSOR_READING : generates
    SENSOR ||--o{ ALERT : triggers
    SENSOR ||--o{ AUTOMATION_RULE : evaluates
    ACTUATOR ||--o{ AUTOMATION_RULE : executes