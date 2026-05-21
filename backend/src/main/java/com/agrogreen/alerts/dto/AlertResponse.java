package com.agrogreen.alerts.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Alerts
 * Description: DTO used to send alert data to the client.
 */
public class AlertResponse {

    private Long id;
    private String sensorCode;
    private String sensorName;
    private Long zoneId;
    private String zoneName;
    private String type;
    private String level;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public AlertResponse() {
    }

    public AlertResponse(
            Long id,
            String sensorCode,
            String sensorName,
            Long zoneId,
            String zoneName,
            String type,
            String level,
            String message,
            String status,
            LocalDateTime createdAt,
            LocalDateTime resolvedAt
    ) {
        this.id = id;
        this.sensorCode = sensorCode;
        this.sensorName = sensorName;
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.type = type;
        this.level = level;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
    }

    public Long getId() {
        return id;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public String getSensorName() {
        return sensorName;
    }

    public Long getZoneId() {
        return zoneId;
    }

    public String getZoneName() {
        return zoneName;
    }

    public String getType() {
        return type;
    }

    public String getLevel() {
        return level;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
}