package com.agrogreen.dashboard.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Dashboard
 * Description: DTO used to show latest alerts in the dashboard.
 */
public class DashboardAlertResponse {

    private Long id;
    private String sensorCode;
    private String sensorName;
    private String zoneName;
    private String type;
    private String level;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public DashboardAlertResponse() {
    }

    public DashboardAlertResponse(
            Long id,
            String sensorCode,
            String sensorName,
            String zoneName,
            String type,
            String level,
            String message,
            String status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.sensorCode = sensorCode;
        this.sensorName = sensorName;
        this.zoneName = zoneName;
        this.type = type;
        this.level = level;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
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
}