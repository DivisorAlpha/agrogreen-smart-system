package com.agrogreen.actuators.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: DTO used to send actuator data to the client.
 */
public class ActuatorResponse {

    private Long id;
    private Long zoneId;
    private String zoneName;
    private String code;
    private String name;
    private String type;
    private String state;
    private String operationalStatus;
    private LocalDateTime lastCommandAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ActuatorResponse() {
    }

    public ActuatorResponse(
            Long id,
            Long zoneId,
            String zoneName,
            String code,
            String name,
            String type,
            String state,
            String operationalStatus,
            LocalDateTime lastCommandAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.code = code;
        this.name = name;
        this.type = type;
        this.state = state;
        this.operationalStatus = operationalStatus;
        this.lastCommandAt = lastCommandAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getZoneId() {
        return zoneId;
    }

    public String getZoneName() {
        return zoneName;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getState() {
        return state;
    }

    public String getOperationalStatus() {
        return operationalStatus;
    }

    public LocalDateTime getLastCommandAt() {
        return lastCommandAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}